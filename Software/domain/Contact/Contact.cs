using domain.Common;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using Dapper.Contrib.Extensions;

namespace domain.Contact
{
    /// <summary>
    /// Контакт
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.contacts")]
    public class Contact : KeyObject, ICommand
    {        
        [Column("employee_id")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public int EmployeeId { get; set; }

        public bool Active { get; set; }

        /// <summary>
        /// Вид контакта
        /// </summary>
        public string Kind { get; set; }

        public string Address { get; set; }
    }
}
