using Kit.Core.CQRS.Command;

namespace domain.Element.Command
{
    public class AddToFavoritesCommand : ICommand
    {
        /// <summary>
        /// Добавить/удалить
        /// </summary>
        public bool Add { get; set; }

        /// <summary>
        /// id элементов
        /// </summary>
        public int[] Ids { get; set; }

        public int UserId { get; set; }

    }
}
