using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;

namespace domain.Organization
{
    [Table("conf_hall.organizations")]
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
