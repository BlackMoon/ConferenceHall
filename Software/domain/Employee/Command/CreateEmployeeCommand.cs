using System.Collections.Generic;
using domain.SysUser;
using Kit.Core.CQRS.Command;

namespace domain.Employee.Command
{
    public class CreateEmployeeCommand : ICommand
    {
        public bool Locked { get; set; }
        
        public int OrgId { get; set; }

        public string Login { get; set; }

        public string Name { get; set; }

        public string Password { get; set; }

        public string Position { get; set; }
       
        public UserRole Role { get; set; }

        public IList<Contact> Contacts { get; set; }
    }
}
