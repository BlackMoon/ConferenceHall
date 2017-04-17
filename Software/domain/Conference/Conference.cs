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
        [Column("subject")]
        public string Subject { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("date_start")]
        public DateTime? DateStart { get; set; }
        [Column("date_end")]
        public DateTime? DateEnd { get; set; }
        [Column("state")]
        public StateType State { get; set; }
        [Column("hall_id")]
        public Hall.Hall Hall { get; set; }
        [Column("hall_scheme_id")]
        public HallScheme.HallScheme HallScheme { get; set; }
    }

    public enum StateType {
         State0 = 0,
         State1 = 1,
         State2 = 2
     };

}
