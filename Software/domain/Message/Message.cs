using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.Message
{
    /// <summary>
    /// Сообщения конференции
    /// </summary>
    [Table("conf_hall.conf_messages")]
    public class Message : KeyObject
    {
        public bool Active { get; set; }

        public string Detail { get; set; }
    }
}
