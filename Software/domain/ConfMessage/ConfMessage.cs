using System;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace domain.ConfMessage
{
    /// <summary>
    /// Сообщения конференции
    /// </summary>
    [Table("conf_hall.conf_messages")]
    public class ConfMessage : KeyObject, ICommand
    {
        [Column("hall_id")]
        public int ConfId { get; set; }

        public string Message { get; set; }

        public bool Active { get; set; }
    }
}
