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
        /// <summary>
        /// Вид контакта
        /// </summary>
        public string Kind { get; set; }

        public string Phone { get; set; }
    }
}
