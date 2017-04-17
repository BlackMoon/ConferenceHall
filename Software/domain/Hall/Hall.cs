using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Hall
{
    [Table("conf_hall.halls")]
    public class Hall : KeyObject, IComponent
    {
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }
    }
}
