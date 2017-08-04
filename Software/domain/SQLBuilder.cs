using System.Collections.Generic;
using System.Text;

namespace domain
{
    /// <summary>
    /// Строитель sql выборок
    /// </summary>
    public class SqlBuilder
    {
        private readonly IList<string> _columns = new List<string>();
        private readonly IList<string> _tables = new List<string>();
        private readonly IList<string> _joins = new List<string>();
        private readonly IList<string> _leftJoins = new List<string>();
        private readonly IList<string> _wheres = new List<string>();
        private readonly IList<string> _orderBys = new List<string>();
        private readonly IList<string> _groupBys = new List<string>();

        private void AppendList(StringBuilder sql, IEnumerable<string> list, string init, string sep)
        {
            bool first = true;

            foreach (string s in list)
            {
                sql.Append(first ? init : sep);
                sql.Append(s);
                first = false;
            }
        }

        public SqlBuilder()
        {
            
        }

        public SqlBuilder(string table)
        {
            _tables.Add(table);
        }

        public SqlBuilder Column(string name)
        {
            _columns.Add(name);
            return this;
        }

        public SqlBuilder Column(string name, bool groupBy)
        {
            _columns.Add(name);

            if (groupBy)
                _groupBys.Add(name);

            return this;
        }

        public SqlBuilder From(string table)
        {
            _tables.Add(table);
            return this;
        }

        public SqlBuilder GroupBy(string expr)
        {
            _groupBys.Add(expr);
            return this;
        }

        public SqlBuilder Join(string join)
        {
            _joins.Add(join);
            return this;
        }

        public SqlBuilder LeftJoin(string join)
        {
            _leftJoins.Add(join);
            return this;
        }

        public SqlBuilder OrderBy(string name)
        {
            _orderBys.Add(name);
            return this;
        }

        public SqlBuilder Where(string expr)
        {
            _wheres.Add(expr);
            return this;
        }


        public override string ToString()
        {
            StringBuilder sb = new StringBuilder("SELECT ");

            if (_columns.Count == 0)
                sb.Append("*");
            else
                AppendList(sb, _columns, "", ", ");

            AppendList(sb, _tables, " FROM ", ", ");
            AppendList(sb, _joins, " JOIN ", " JOIN ");
            AppendList(sb, _leftJoins, " LEFT JOIN ", " LEFT JOIN ");
            AppendList(sb, _wheres, " WHERE ", " AND ");
            AppendList(sb, _groupBys, " GROUP BY ", ", ");
            AppendList(sb, _orderBys, " ORDER BY ", ", ");

            return sb.ToString();
        }
    }
}
