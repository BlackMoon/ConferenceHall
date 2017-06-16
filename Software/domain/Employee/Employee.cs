using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;

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

        public string Name { get; set; }

        /// <summary>
        /// Должность
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// Роль (для пользователей)
        /// </summary>
        [Write(false)]
        public string Role { get; set; }

        [Write(false)]
        public IList<Contact> Contacts { get; set; }
    }
}
