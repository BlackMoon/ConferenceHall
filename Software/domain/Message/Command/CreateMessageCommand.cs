using Kit.Core.CQRS.Command;

namespace domain.Message.Command
{
    /// <summary>
    /// Команда. Создание сообщения конференции
    /// </summary>
    public class CreateMessageCommand : ICommand
    {
        public int ConferenceId { get; set; }

        public string Content { get; set; }
    }
}
