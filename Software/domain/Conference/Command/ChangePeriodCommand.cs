using System;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Изменить интервал события
    /// </summary>
    public class ChangePeriodCommand : AbstractConferenceCommand
    {
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
