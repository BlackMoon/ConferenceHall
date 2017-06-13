using domain.Common;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;

namespace domain.Organization
{
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.organizations")]
    public class Organization : KeyObject, ICommand
    {
        /// <summary>
        /// Адрес
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Код
        /// </summary>
        public string Code { get; set; }

        [Write(false)]
        public string ContentType { get; set; }
        /// <summary>
        /// Описание
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Иконка
        /// </summary>
        public byte[] Icon { get; set; }

        /// <summary>
        /// Логотип
        /// </summary>
        public byte[] Logo { get; set; }

        /// <summary>
        /// Неаименование
        /// </summary>
        public string Name { get; set; }
    }
}
