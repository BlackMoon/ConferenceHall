using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.Contact
{
    /// <summary>
    /// Контакт
    /// </summary>
    [Table("conf_hall.contacts")]
    public class Contact : KeyObject
    {
        public bool Active { get; set; }

        /// <summary>
        /// Вид контакта
        /// </summary>
        public string Kind { get; set; }

        public string Address { get; set; }
    }
}
