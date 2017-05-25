using System;
using Kit.Core.CQRS.Command;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Назначить совещание
    /// </summary>
    public class MakeAppointmentCommand : ICommand
    {
        /// <summary>
        /// id конференции
        /// </summary>
        public int ConferenceId { get; set; }

        /// <summary>
        /// № холла
        /// </summary>
        public int HallId { get; set; }

        /// <summary>
        /// Дата начала
        /// </summary>
        public DateTime Start { get; set; }

        /// <summary>
        /// Длительность
        /// </summary>
        public TimeSpan Duration { get; set; }
    }
}
