using System;
using Kit.Core.CQRS.Command;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Изменить интервал события
    /// </summary>
    public class ChangePeriodCommand : ICommand
    {
        public int ConferenceId { get; set; }

        public DateTime Start { get; set; }

        public TimeSpan Delta { get; set; }
    }
}
