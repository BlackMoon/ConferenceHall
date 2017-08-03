using Kit.Core.CQRS.Command;
using System;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Назначить совещание
    /// </summary>
    public class MakeAppointmentCommand : ICommand
    {
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
