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
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        /// <summary>
        /// Реальная высота, м
        /// </summary>
        public float Height { get; set; }
        
        /// <summary>
        /// Реальная ширина, м
        /// </summary>
        public float Width { get; set; }

        [Dapper.Contrib.Extensions.Write(false)]
        public IList<Scheme.Scheme> Schemes { get; set; }
    }
}
