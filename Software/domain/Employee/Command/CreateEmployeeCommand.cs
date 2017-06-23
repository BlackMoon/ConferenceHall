using System.Collections.Generic;
using Kit.Core.CQRS.Command;

namespace domain.Employee.Command
{
    public class CreateEmployeeCommand : ICommand
    {   
        public int OrgId { get; set; }     

        public string Name { get; set; }        

        public string Position { get; set; }
       
        public SysUser.SysUser User { get; set; }        
    }
}
