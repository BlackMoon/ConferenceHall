using Kit.Core.CQRS.Command;

namespace domain.Scheme.Command
{
    public class CreateSchemeCommand : ICommand
    {
        public string Name { get; set; }

        public int HallId { get; set; }
    }
}
