using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;

namespace domain.Employee
{
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.employees")]
    public class Employee : KeyObject, ICommand
    {
        [Column("org_id")]
        public int OrgId { get; set; }      

        public string Name { get; set; }
        
        /// <summary>
        /// Должность
        /// </summary>
        public string Position { get; set; }        

        [Write(false)]
        public SysUser.SysUser User { get; set; }

        [Write(false)]
        public IList<Contact.Contact> Contacts { get; set; }
    }
}
