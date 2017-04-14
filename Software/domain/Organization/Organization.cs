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
        [Column("code")]
        public string Code { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("address")]
        public string Address { get; set; }
        [Column("logo")]
        public string Logo { get; set; }

    }
}
