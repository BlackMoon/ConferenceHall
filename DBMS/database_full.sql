--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.0

-- Started on 2017-04-17 09:36:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 16385)
-- Name: conf_hall; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA conf_hall;


ALTER SCHEMA conf_hall OWNER TO postgres;

--
-- TOC entry 1 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2269 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 16470)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 2271 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = conf_hall, pg_catalog;

--
-- TOC entry 654 (class 1247 OID 16387)
-- Name: conf_state; Type: TYPE; Schema: conf_hall; Owner: postgres
--

CREATE TYPE conf_state AS ENUM (
    'Планирование',
    'Ожидание',
    'Идет',
    'Завершено'
);


ALTER TYPE conf_state OWNER TO postgres;

--
-- TOC entry 655 (class 1247 OID 16517)
-- Name: user_role; Type: TYPE; Schema: conf_hall; Owner: postgres
--

CREATE TYPE user_role AS ENUM (
    'user',
    'power_user',
    'admin'
);


ALTER TYPE user_role OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 16513)
-- Name: user_crypt_password(character varying); Type: FUNCTION; Schema: conf_hall; Owner: postgres
--

CREATE FUNCTION user_crypt_password(ppassword character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
declare

begin
  return crypt(ppassword, gen_salt('bf', 8));
end;
$$;


ALTER FUNCTION conf_hall.user_crypt_password(ppassword character varying) OWNER TO postgres;

--
-- TOC entry 254 (class 1255 OID 16601)
-- Name: user_logon(character varying, character varying); Type: FUNCTION; Schema: conf_hall; Owner: postgres
--

CREATE FUNCTION user_logon(plogin character varying, ppassword character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  cuser cursor(plogin varchar) is
    select
      u.*
    from
      conf_hall.users as u
    where
      u.login = plogin;
      
  xuser conf_hall.users%rowtype;
  xcheck boolean;
begin
  if plogin is null then
    raise exception using
      message = 'Вход запрещен'
      , detail = 'Не указано имя пользователя.';
  end if;

  open cuser(plogin);
  fetch cuser into xuser;
  close cuser;
  
  if xuser.id is null then
    raise exception using
      message = 'Вход запрещен'
      , detail = 'Пользователь с таким именем не найден.';
  end if;

  if xuser.locked then
    raise exception using
      message = 'Вход запрещен'
      , detail = 'Пользователь с таким именем заблокирован.';
  end if;
  
  xcheck := xuser.password = crypt(ppassword, xuser.password);
  if not xcheck then
    raise exception using
      message = 'Вход запрещен'
      , detail = 'Неверный пароль.';
  end if;
end;
$$;


ALTER FUNCTION conf_hall.user_logon(plogin character varying, ppassword character varying) OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 16509)
-- Name: user_new_handler(); Type: FUNCTION; Schema: conf_hall; Owner: postgres
--

CREATE FUNCTION user_new_handler() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
begin
  new.password := conf_hall.user_crypt_password(new.password);
  return new;
end;
$$;


ALTER FUNCTION conf_hall.user_new_handler() OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 16507)
-- Name: users_change_handler(); Type: FUNCTION; Schema: conf_hall; Owner: postgres
--

CREATE FUNCTION users_change_handler() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
begin
  new.password := conf_hall.user_crypt_password(new.password);
  return new;
end;
$$;


ALTER FUNCTION conf_hall.users_change_handler() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 187 (class 1259 OID 16395)
-- Name: conf_members; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE conf_members (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    conf_id integer NOT NULL
);


ALTER TABLE conf_members OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 16398)
-- Name: conf_members_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE conf_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE conf_members_id_seq OWNER TO postgres;

--
-- TOC entry 2276 (class 0 OID 0)
-- Dependencies: 188
-- Name: conf_members_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE conf_members_id_seq OWNED BY conf_members.id;


--
-- TOC entry 189 (class 1259 OID 16400)
-- Name: conferences; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE conferences (
    id integer NOT NULL,
    subject character varying(2048) NOT NULL,
    description character varying(4096),
    date_start timestamp(0) without time zone,
    date_end timestamp(0) without time zone,
    state conf_state DEFAULT 'Планирование'::conf_state NOT NULL,
    hall_id integer,
    hall_scheme_id integer
);


ALTER TABLE conferences OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 16407)
-- Name: conferences_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE conferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE conferences_id_seq OWNER TO postgres;

--
-- TOC entry 2279 (class 0 OID 0)
-- Dependencies: 190
-- Name: conferences_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE conferences_id_seq OWNED BY conferences.id;


--
-- TOC entry 191 (class 1259 OID 16409)
-- Name: employees; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE employees (
    id integer NOT NULL,
    name character varying(1024) NOT NULL,
    org_id integer NOT NULL,
    job_title character varying(512),
    phones_list character varying(25)[],
    emails_list character varying(255)[]
);


ALTER TABLE employees OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 16415)
-- Name: employes_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE employes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE employes_id_seq OWNER TO postgres;

--
-- TOC entry 2282 (class 0 OID 0)
-- Dependencies: 192
-- Name: employes_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE employes_id_seq OWNED BY employees.id;


--
-- TOC entry 202 (class 1259 OID 16592)
-- Name: files; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE files (
    id integer NOT NULL,
    name character varying(1024),
    data bytea,
    owner_id integer NOT NULL
);


ALTER TABLE files OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16590)
-- Name: files_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE files_id_seq OWNER TO postgres;

--
-- TOC entry 2285 (class 0 OID 0)
-- Dependencies: 201
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE files_id_seq OWNED BY files.id;


--
-- TOC entry 200 (class 1259 OID 16571)
-- Name: hall_scheme; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE hall_scheme (
    id integer NOT NULL,
    name character varying NOT NULL,
    scheme text,
    hall_id integer
);


ALTER TABLE hall_scheme OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 16569)
-- Name: hall_scheme_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE hall_scheme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hall_scheme_id_seq OWNER TO postgres;

--
-- TOC entry 2288 (class 0 OID 0)
-- Dependencies: 199
-- Name: hall_scheme_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE hall_scheme_id_seq OWNED BY hall_scheme.id;


--
-- TOC entry 198 (class 1259 OID 16545)
-- Name: halls; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE halls (
    id integer NOT NULL,
    name character varying(512) NOT NULL,
    description character varying(2048)
);


ALTER TABLE halls OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16543)
-- Name: halls_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE halls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE halls_id_seq OWNER TO postgres;

--
-- TOC entry 2291 (class 0 OID 0)
-- Dependencies: 197
-- Name: halls_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE halls_id_seq OWNED BY halls.id;


--
-- TOC entry 193 (class 1259 OID 16417)
-- Name: organizations; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE organizations (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(512) NOT NULL,
    description character varying(4096),
    address character varying(4096),
    logo bytea
);


ALTER TABLE organizations OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 16423)
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE organizations_id_seq OWNER TO postgres;

--
-- TOC entry 2294 (class 0 OID 0)
-- Dependencies: 194
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE organizations_id_seq OWNED BY organizations.id;


--
-- TOC entry 195 (class 1259 OID 16425)
-- Name: users; Type: TABLE; Schema: conf_hall; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    login character varying(512),
    password character varying(512),
    locked boolean DEFAULT false NOT NULL,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    employee_id integer NOT NULL
);


ALTER TABLE users OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16431)
-- Name: users_id_seq; Type: SEQUENCE; Schema: conf_hall; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- TOC entry 2297 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: conf_hall; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 2098 (class 2604 OID 16433)
-- Name: conf_members id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conf_members ALTER COLUMN id SET DEFAULT nextval('conf_members_id_seq'::regclass);


--
-- TOC entry 2100 (class 2604 OID 16434)
-- Name: conferences id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conferences ALTER COLUMN id SET DEFAULT nextval('conferences_id_seq'::regclass);


--
-- TOC entry 2101 (class 2604 OID 16435)
-- Name: employees id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY employees ALTER COLUMN id SET DEFAULT nextval('employes_id_seq'::regclass);


--
-- TOC entry 2108 (class 2604 OID 16595)
-- Name: files id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY files ALTER COLUMN id SET DEFAULT nextval('files_id_seq'::regclass);


--
-- TOC entry 2107 (class 2604 OID 16574)
-- Name: hall_scheme id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY hall_scheme ALTER COLUMN id SET DEFAULT nextval('hall_scheme_id_seq'::regclass);


--
-- TOC entry 2106 (class 2604 OID 16548)
-- Name: halls id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY halls ALTER COLUMN id SET DEFAULT nextval('halls_id_seq'::regclass);


--
-- TOC entry 2102 (class 2604 OID 16436)
-- Name: organizations id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY organizations ALTER COLUMN id SET DEFAULT nextval('organizations_id_seq'::regclass);


--
-- TOC entry 2103 (class 2604 OID 16437)
-- Name: users id; Type: DEFAULT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2110 (class 2606 OID 16439)
-- Name: conf_members conf_members_pkey; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conf_members
    ADD CONSTRAINT conf_members_pkey PRIMARY KEY (id);


--
-- TOC entry 2112 (class 2606 OID 16441)
-- Name: conf_members conf_members_uniq_key; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conf_members
    ADD CONSTRAINT conf_members_uniq_key UNIQUE (employee_id, conf_id);


--
-- TOC entry 2114 (class 2606 OID 16443)
-- Name: conferences conferences_id_key; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conferences
    ADD CONSTRAINT conferences_id_key UNIQUE (id);


--
-- TOC entry 2116 (class 2606 OID 16445)
-- Name: employees employes_id_key; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY employees
    ADD CONSTRAINT employes_id_key UNIQUE (id);


--
-- TOC entry 2134 (class 2606 OID 16600)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 2132 (class 2606 OID 16579)
-- Name: hall_scheme hall_scheme_pkey; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY hall_scheme
    ADD CONSTRAINT hall_scheme_pkey PRIMARY KEY (id);


--
-- TOC entry 2128 (class 2606 OID 16553)
-- Name: halls halls_pkey; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY halls
    ADD CONSTRAINT halls_pkey PRIMARY KEY (id);


--
-- TOC entry 2130 (class 2606 OID 16555)
-- Name: halls halls_u1; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY halls
    ADD CONSTRAINT halls_u1 UNIQUE (name);


--
-- TOC entry 2120 (class 2606 OID 16447)
-- Name: organizations organizations_id_key; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_id_key UNIQUE (id);


--
-- TOC entry 2122 (class 2606 OID 16559)
-- Name: users users_pk; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- TOC entry 2124 (class 2606 OID 16561)
-- Name: users users_u1; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_u1 UNIQUE (login);


--
-- TOC entry 2126 (class 2606 OID 16563)
-- Name: users users_u2; Type: CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_u2 UNIQUE (employee_id);


--
-- TOC entry 2117 (class 1259 OID 16556)
-- Name: organizations_i1; Type: INDEX; Schema: conf_hall; Owner: postgres
--

CREATE INDEX organizations_i1 ON organizations USING btree (code);


--
-- TOC entry 2118 (class 1259 OID 16557)
-- Name: organizations_i2; Type: INDEX; Schema: conf_hall; Owner: postgres
--

CREATE INDEX organizations_i2 ON organizations USING btree (name);


--
-- TOC entry 2143 (class 2620 OID 16514)
-- Name: users users_change_tr; Type: TRIGGER; Schema: conf_hall; Owner: postgres
--

CREATE TRIGGER users_change_tr BEFORE UPDATE OF password ON users FOR EACH ROW EXECUTE PROCEDURE users_change_handler();


--
-- TOC entry 2142 (class 2620 OID 16510)
-- Name: users users_new_tr; Type: TRIGGER; Schema: conf_hall; Owner: postgres
--

CREATE TRIGGER users_new_tr BEFORE INSERT ON users FOR EACH ROW EXECUTE PROCEDURE user_new_handler();


--
-- TOC entry 2135 (class 2606 OID 16448)
-- Name: conf_members conf_members_conf_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conf_members
    ADD CONSTRAINT conf_members_conf_fk FOREIGN KEY (conf_id) REFERENCES conferences(id);


--
-- TOC entry 2136 (class 2606 OID 16453)
-- Name: conf_members conf_members_empl_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conf_members
    ADD CONSTRAINT conf_members_empl_fk FOREIGN KEY (employee_id) REFERENCES employees(id);


--
-- TOC entry 2137 (class 2606 OID 16564)
-- Name: conferences conferences_hall_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conferences
    ADD CONSTRAINT conferences_hall_fk FOREIGN KEY (hall_id) REFERENCES halls(id);


--
-- TOC entry 2138 (class 2606 OID 16585)
-- Name: conferences conferences_hall_scheme_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY conferences
    ADD CONSTRAINT conferences_hall_scheme_fk FOREIGN KEY (hall_scheme_id) REFERENCES hall_scheme(id);


--
-- TOC entry 2139 (class 2606 OID 16458)
-- Name: employees employes_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY employees
    ADD CONSTRAINT employes_fk FOREIGN KEY (org_id) REFERENCES organizations(id);


--
-- TOC entry 2141 (class 2606 OID 16580)
-- Name: hall_scheme hall_scheme_hall_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY hall_scheme
    ADD CONSTRAINT hall_scheme_hall_fk FOREIGN KEY (hall_id) REFERENCES halls(id);


--
-- TOC entry 2140 (class 2606 OID 16537)
-- Name: users users_empl_fk; Type: FK CONSTRAINT; Schema: conf_hall; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_empl_fk FOREIGN KEY (employee_id) REFERENCES employees(id);


--
-- TOC entry 2266 (class 0 OID 0)
-- Dependencies: 8
-- Name: conf_hall; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA conf_hall TO role_full_access;


--
-- TOC entry 2268 (class 0 OID 0)
-- Dependencies: 4
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO role_full_access;


--
-- TOC entry 2270 (class 0 OID 0)
-- Dependencies: 659
-- Name: plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO role_full_access;


--
-- TOC entry 2272 (class 0 OID 0)
-- Dependencies: 654
-- Name: conf_state; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON TYPE conf_state TO role_full_access;


--
-- TOC entry 2273 (class 0 OID 0)
-- Dependencies: 655
-- Name: user_role; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON TYPE user_role TO role_full_access;


--
-- TOC entry 2274 (class 0 OID 0)
-- Dependencies: 254
-- Name: user_logon(character varying, character varying); Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON FUNCTION user_logon(plogin character varying, ppassword character varying) TO role_full_access;


--
-- TOC entry 2275 (class 0 OID 0)
-- Dependencies: 187
-- Name: conf_members; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE conf_members TO role_full_access;


--
-- TOC entry 2277 (class 0 OID 0)
-- Dependencies: 188
-- Name: conf_members_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE conf_members_id_seq TO role_full_access;


--
-- TOC entry 2278 (class 0 OID 0)
-- Dependencies: 189
-- Name: conferences; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE conferences TO role_full_access;


--
-- TOC entry 2280 (class 0 OID 0)
-- Dependencies: 190
-- Name: conferences_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE conferences_id_seq TO role_full_access;


--
-- TOC entry 2281 (class 0 OID 0)
-- Dependencies: 191
-- Name: employees; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE employees TO role_full_access;


--
-- TOC entry 2283 (class 0 OID 0)
-- Dependencies: 192
-- Name: employes_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE employes_id_seq TO role_full_access;


--
-- TOC entry 2284 (class 0 OID 0)
-- Dependencies: 202
-- Name: files; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE files TO role_full_access;


--
-- TOC entry 2286 (class 0 OID 0)
-- Dependencies: 201
-- Name: files_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE files_id_seq TO role_full_access;


--
-- TOC entry 2287 (class 0 OID 0)
-- Dependencies: 200
-- Name: hall_scheme; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE hall_scheme TO role_full_access;


--
-- TOC entry 2289 (class 0 OID 0)
-- Dependencies: 199
-- Name: hall_scheme_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE hall_scheme_id_seq TO role_full_access;


--
-- TOC entry 2290 (class 0 OID 0)
-- Dependencies: 198
-- Name: halls; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE halls TO role_full_access;


--
-- TOC entry 2292 (class 0 OID 0)
-- Dependencies: 197
-- Name: halls_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE halls_id_seq TO role_full_access;


--
-- TOC entry 2293 (class 0 OID 0)
-- Dependencies: 193
-- Name: organizations; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE organizations TO role_full_access;


--
-- TOC entry 2295 (class 0 OID 0)
-- Dependencies: 194
-- Name: organizations_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE organizations_id_seq TO role_full_access;


--
-- TOC entry 2296 (class 0 OID 0)
-- Dependencies: 195
-- Name: users; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE users TO role_full_access;


--
-- TOC entry 2298 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: ACL; Schema: conf_hall; Owner: postgres
--

GRANT ALL ON SEQUENCE users_id_seq TO role_full_access;


-- Completed on 2017-04-17 09:36:28

--
-- PostgreSQL database dump complete
--

