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

        [Column("height")]
        public double Height { get; set; }

        [Column("width")]
        public double Width { get; set; }

        public IList<Scheme.Scheme> Schemes { get; set; }
    }
}
