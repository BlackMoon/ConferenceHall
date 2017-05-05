using Kit.Core.CQRS.Command;

namespace domain.Scheme.Command
{
    /// <summary>
    /// Команда привязана к таблице, т.к. для создания требуется hallId
    /// </summary>
    public class CreateSchemeCommand : ICommand
    {
        public string Name { get; set; }

        public int HallId { get; set; }
    }
}
