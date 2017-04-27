using Kit.Core.CQRS.Command;

namespace domain.Element.Command
{
    public class AddToFavoritesCommand : ICommand
    {
        public bool Favorite { get; set; }

        public int ElementId { get; set; }

        public int UserId { get; set; }

    }
}
