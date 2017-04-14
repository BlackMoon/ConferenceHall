using System;
using System.Collections.Generic;
using System.Text;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Document
{
    [Table("conf_hall.files")]
    public class Document : KeyObject, IComponent
    {
        [Column("name")]
        public string Name { get; set; }
        [Column("data")]
        public byte Data { get; set; }
        [Column("owner_id")]
        public int OwnerId { get; set; }
    }
}
