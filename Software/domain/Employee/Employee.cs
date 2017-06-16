﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;
using domain.SysUser;
using System;

namespace domain.Employee
{
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.employees")]
    public class Employee : KeyObject, ICommand
    {
        /// <summary>
        /// Заблокирован? (для пользователей)
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        [Write(false)]
        public bool Locked { get; set; }

        [Column("org_id")]
        public int OrgId { get; set; }

        /// <summary>
        /// Логин (для пользователей)
        /// </summary>
        [Write(false)]
        public string Login { get; set; }

        public string Name { get; set; }

        /// <summary>
        /// Пароль (для пользователей)
        /// </summary>
        [Write(false)]
        public string Password { get; set; }

        /// <summary>
        /// Должность
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// Роль (для пользователей)
        /// </summary>
        [Write(false)]
        public UserRole UserRole { get; set; }

        [Column("role")]
        [JsonIgnore]
        public string Role
        {
            set
            {
                UserRole userRole;
                Enum.TryParse(value, true, out userRole);
                UserRole = userRole;
            }
        }

        [Write(false)]
        public IList<Contact> Contacts { get; set; }
    }
}
