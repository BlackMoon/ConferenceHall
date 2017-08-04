using domain.Common.Command;

namespace domain.Element.Command
{
    /// <summary>
    /// Команда. Добавить в избранное
    /// </summary>
    public class AddToFavoritesCommand : GroupCommand
    {
        public int UserId { get; set; }

    }
}
