using Kit.Core.CQRS.Command;

namespace domain.Ticker.Command
{
    /// <summary>
    /// Команда. Частичное обновление сообщения (могут задаваться разные свойства)
    /// </summary>
    public class PartialUpdateCommand : ICommand
    {
        public int MessageId { get; set; }

        public bool? Active { get; set; }

        public string Content { get; set; }
    }
}
