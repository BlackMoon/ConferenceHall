using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
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
       
        public string Name { get; set; }
        
        public string Plan { get; set; }

    }
}
