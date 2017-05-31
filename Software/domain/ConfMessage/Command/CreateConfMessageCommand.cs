using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;
using System;

namespace domain.ConfMessage.Command
{
    /// <summary>
    /// Команда. Создание сообщения конференции
    /// </summary>
    public class CreateConfMessageCommand : ICommand
    {
        [Column("hall_id")]
        public int ConfId { get; set; }

        public string Message { get; set; }

        public bool Active { get; set; }
    }
}
