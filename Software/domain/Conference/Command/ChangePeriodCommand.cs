using System;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Изменить интервал события
    /// </summary>
    public class ChangePeriodCommand : MakeAppointmentCommand
    {
        /// <summary>
        /// Дата окончания (опционально)
        /// </summary>
        public DateTime? End { get; set; }
    }
}
