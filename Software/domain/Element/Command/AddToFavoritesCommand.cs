using Kit.Core.CQRS.Command;

namespace domain.Element.Command
{
    /// <summary>
    /// Команда. Добавить в избранное
    /// </summary>
    public class AddToFavoritesCommand : ICommand
    {
        /// <summary>
        /// id элементов
        /// </summary>
        public int[] Ids { get; set; }

        public int UserId { get; set; }

    }
}
