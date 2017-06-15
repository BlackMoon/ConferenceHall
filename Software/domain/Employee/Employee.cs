using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Newtonsoft.Json;

namespace domain.Employee
{
    [Table("conf_hall.employees")]
    public class Employee : KeyObject
    {
        /// <summary>
        /// Заблокирован? (для пользователей)
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
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
        public string Role { get; set; }

        public IList<Contact> Contacts { get; set; }
    }
}
