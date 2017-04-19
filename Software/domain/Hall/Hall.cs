using System.Collections.Generic;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;

namespace domain.Hall
{
    /// <summary>
    /// Модель. Конференц-халл
    /// </summary>
    [Table("conf_hall.halls")]
    public class Hall : KeyObject, ICommand
    {
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        //[Column("size")]
        //public NpgsqlTypes.NpgsqlPoint Size { get; set; }

        public IList<Scheme> Schemes { get; set; }
    }
}
