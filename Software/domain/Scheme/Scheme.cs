using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;

namespace domain.Scheme
{
    /// <summary>
    /// Модель. Схема конференц-холла
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.hall_scheme")]
    public class Scheme : KeyObject, ICommand
    {
        [Column("hall_id")]
        [JsonIgnore]
        public int HallId { get; set; }

        /// <summary>
        /// Шаг сетки (0 - сетка не рисуется)
        /// </summary>
        [Column("grid_interval")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public float GridInterval { get; set; }

        public string Name { get; set; }
        
        public string Plan { get; set; }

        /// <summary>
        /// Реальная высота, м (копируется из Холла)
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        [Write(false)]
        public float Height { get; set; }

        /// <summary>
        /// Реальная ширина, м (копируется из Холла)
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        [Write(false)]
        public float Width { get; set; }
    }
}
