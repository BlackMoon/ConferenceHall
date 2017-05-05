using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;

namespace domain.Scheme
{
    /// <summary>
    /// Модель. Схема конференц-холла
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.hall_scheme")]
    public class Scheme : KeyObject, ICommand
    {
        [Column("hall_id")]
        public int HallId { get; set; }
       
        public string Name { get; set; }
        
        public string Plan { get; set; }

        /// <summary>
        /// Реальная высота, м
        /// </summary>
        [Write(false)]
        public float Height { get; set; }

        /// <summary>
        /// Реальная ширина, м
        /// </summary>
        [Write(false)]
        public float Width { get; set; }
    }
}
