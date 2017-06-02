using System;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Назначить совещание
    /// </summary>
    public class MakeAppointmentCommand : AbstractConferenceCommand
    {
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
