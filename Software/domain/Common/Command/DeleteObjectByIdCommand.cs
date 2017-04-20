using Kit.Core.CQRS.Command;

namespace domain.Common.Command
{
    /// <summary>
    /// Команда. Удалить объект по ключу
    /// </summary>
    public class DeleteObjectByIdCommand : ICommand
    {
        public int Id { get; set; }
    }
}
