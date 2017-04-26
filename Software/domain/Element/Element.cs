using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;

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

        [Column("mime_type")]
        public string MimeType { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Эскиз
        /// </summary>
        [JsonIgnore]
        public byte[] Data { get; set; }

        /// <summary>
        /// Миниатюра
        /// </summary>
        [JsonIgnore]
        public byte[] Thumbnail { get; set; }

        /// <summary>
        /// Реальная высота, м
        /// </summary>
        public float Height { get; set; }

        /// <summary>
        /// Реальная ширина, м
        /// </summary>
        public float Width { get; set; }
    }
}
