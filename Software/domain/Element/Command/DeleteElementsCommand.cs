using Kit.Core.CQRS.Command;

namespace domain.Element.Command
{
    public class DeleteElementsCommand : ICommand
    {
        public int UserId { get; set; }

        public int[] Ids { get; set; }
    }
}
