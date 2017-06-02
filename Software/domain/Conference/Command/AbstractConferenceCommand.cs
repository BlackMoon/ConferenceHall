using Kit.Core.CQRS.Command;

namespace domain.Conference.Command
{
    /// <summary>
    /// Абстрактная команда манипуляции конференцией
    /// </summary>
    public abstract class AbstractConferenceCommand : ICommand
    {
        /// <summary>
        /// id конференции
        /// </summary>
        public int ConferenceId { get; set; }
    }
}
