using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Kit.Core.CQRS.Command;

namespace domain.Element
{
    /// <summary>
    /// Модель. Элемент схемы
    /// </summary>
    [Table("conf_hall.scheme_elements")]
    public class Element : KeyObject, ICommand
    {
        /// <summary>
        /// Код
        /// </summary>
        [Dapper.Contrib.Extensions.Write(false)]
        public string Code { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Эскиз
        /// </summary>
        public byte[] Data { get; set; }

        /// <summary>
        /// Миниатюра
        /// </summary>
        public byte[] Thumbnail { get; set; }

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
