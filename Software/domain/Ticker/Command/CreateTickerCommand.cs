using Kit.Core.CQRS.Command;

namespace domain.Ticker.Command
{
    /// <summary>
    /// Команда. Создание сообщения конференции
    /// </summary>
    public class CreateTickerCommand : ICommand
    {
        public bool Active { get; set; }

        public int ConferenceId { get; set; }

        public string Content { get; set; }
    }
}
