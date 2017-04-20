using domain.Common;
using Kit.Core.CQRS.Command;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Dapper.Contrib.Extensions.Write(false)]
        public IList<Scheme.Scheme> Schemes { get; set; }
    }
}
