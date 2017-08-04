using domain.Common;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Employee
{
    [Table("conf_hall.employees")]
    public class Employee : KeyObject, ICommand
    {
        [Column("org_id")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public int OrgId { get; set; }      

        public string Name { get; set; }
        
        /// <summary>
        /// Должность
        /// </summary>
        public string Position { get; set; }        

        [Dapper.Contrib.Extensions.Write(false)]
        public SysUser.SysUser User { get; set; }

        [Dapper.Contrib.Extensions.Write(false)]
        public IList<Contact.Contact> Contacts { get; set; }
    }
}
