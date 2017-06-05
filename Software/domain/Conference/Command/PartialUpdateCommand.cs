using Kit.Core.CQRS.Command;
using System;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Частичное обновление конференции (могут задаваться разные свойства)
    /// </summary>
    public class PartialUpdateCommand: ICommand
    {
        public int ConferenceId { get; set; }

        /// <summary>
        /// Статус
        /// </summary>
        public ConfState? State { get; set; }

        /// <summary>
        /// Дата начала
        /// </summary>
        public DateTime? StartDate { get; set; }

        /// <summary>
        /// Дата окончания (опционально)
        /// </summary>
        public DateTime? EndDate { get; set; }
    }
}
