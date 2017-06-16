using System.Collections.Generic;
using Kit.Core.CQRS.Command;

namespace domain.Employee.Command
{
    public class CreateEmployeeCommand : ICommand
    {
        public bool Locked { get; set; }
        
        public int OrgId { get; set; }

        public string Name { get; set; }
        
        public string Position { get; set; }
       
        public string Role { get; set; }

        public IList<Contact> Contacts { get; set; }
    }
}
