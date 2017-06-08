using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace domain.Employee
{
    [Table("conf_hall.employees")]
    public class Employee
    {
        public string Name { get; set; }

        public int LockedInt { get; set; }

        /// <summary>
        /// Заблокирован? (для пользователей)
        /// </summary>

        [Column("locked")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        [JsonIgnore]
        public bool Locked
        {
            set
            {
                LockedInt = value ? 1 : 0;
            }
        }


        /// <summary>
        /// Должность
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// Организация
        /// </summary>
        public string Job { get; set; }

        /// <summary>
        /// Роль (для пользователей)
        /// </summary>
        public string Role { get; set; }

        public IList<Contact.Contact> Contacts { get; set; }
    }
}
