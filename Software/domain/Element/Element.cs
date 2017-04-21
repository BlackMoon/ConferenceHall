using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.Element
{
    /// <summary>
    /// Модель. Элемент схемы
    /// </summary>
    [Table("conf_hall.scheme_items")]
    public class Element : KeyObject
    {
        /// <summary>
        /// Код
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Эскиз
        /// </summary>
        public byte Data { get; set; }

        /// <summary>
        /// Высота
        /// </summary>
        public double Height { get; set; }

        /// <summary>
        /// Ширина
        /// </summary>
        public double Width { get; set; }
    }
}
