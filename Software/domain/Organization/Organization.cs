using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;

namespace domain.Organization
{
    [Table("conf_hall.organizations")]
    public class Organization : KeyObject, ICommand
    {
        public string Address { get; set; }

        public string Code { get; set; }
      
        public string Name { get; set; }
      
        public string Description { get; set; }
    }
}
