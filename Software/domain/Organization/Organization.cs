using System;
using System.Collections.Generic;
using System.Text;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Organization
{
    [Table("conf_hall.organizations")]
    public class Organization : KeyObject, IComponent
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Logo { get; set; }

    }
}
