using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.Scheme
{
    /// <summary>
    /// Модель. Схема конференц-холла
    /// </summary>
    [Table("conf_hall.hall_scheme")]
    public class Scheme : KeyObject
    {
        [Column("name")]
        public string Name { get; set; }
    }
}
