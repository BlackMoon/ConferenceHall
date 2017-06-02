using System;
using Kit.Core.CQRS.Command;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Изменить интервал события
    /// </summary>
    public class ChangePeriodCommand : ICommand
    {
        /// <summary>
        /// id конференции
        /// </summary>
        public int ConferenceId { get; set; }

        /// <summary>
        /// Дата начала
        /// </summary>
        public DateTime Start { get; set; }

        /// <summary>
        /// Дата окончания (опционально)
        /// </summary>
        public DateTime? End { get; set; }
    }
}
