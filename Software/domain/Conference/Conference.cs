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
        public string State { get; set; }
        [Column("hall_id")]
        public Hall.Hall HallId { get; set; }
        [Column("hall_scheme_id")]
        public HallScheme.HallScheme HallSchemeId { get; set; }
    }

}
