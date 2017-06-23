using Kit.Core.CQRS.Command;

namespace domain.Message.Command
{
    /// <summary>
    /// Команда. Частичное обновление сообщения (могут задаваться разные свойства)
    /// </summary>
    public class PartialUpdateCommand : ICommand
    {
        public bool Active { get; set; }

        public string Content { get; set; }
    }
}
