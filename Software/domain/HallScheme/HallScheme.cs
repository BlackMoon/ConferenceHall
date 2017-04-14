using System;
using System.Collections.Generic;
using System.Text;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.HallScheme
{
    [Table("conf_hall.hall_scheme")]
    public class HallScheme : KeyObject, IComponent
    {
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }
    }
}
