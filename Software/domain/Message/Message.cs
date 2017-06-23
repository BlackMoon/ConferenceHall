using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Kit.Core.CQRS.Command;
using Newtonsoft.Json;

namespace domain.Message
{
    /// <summary>
    /// Сообщения конференции
    /// </summary>
    [Table("conf_hall.conf_messages")]
    public class Message : KeyObject, ICommand
    {        
        [Column("conf_id")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public int ConferenceId { get; set; }

        public bool Active { get; set; }

        public string Content { get; set; }
    }
}
