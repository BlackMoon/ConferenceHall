using System;
using System.Collections.Generic;
using System.Text;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Conference
{
    [Table("conf_hall.conferences")]
    public class Conference : KeyObject, IComponent
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public string State { get; set; }
    }

}
