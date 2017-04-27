using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;

namespace domain.Element
{
    /// <summary>
    /// Модель. Элемент схемы
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.scheme_elements")]
    public class Element : KeyObject, ICommand
    {
        /// <summary>
        /// Элемент в [избранном]?
        /// </summary>
        [Write(false)]
        public bool Favorite { get; set; }

        /// <summary>
        /// Код
        /// </summary>
        [Write(false)]
        public string Code { get; set; }

        [Column("mime_type")]
        public string MimeType { get; set; } = "image/*";

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
