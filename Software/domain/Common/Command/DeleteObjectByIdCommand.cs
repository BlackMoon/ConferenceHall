using Kit.Core.CQRS.Command;

namespace domain.Common.Command
{
    public class DeleteObjectByIdCommand : ICommand
    {
        public int Id { get; set; }
    }
}
