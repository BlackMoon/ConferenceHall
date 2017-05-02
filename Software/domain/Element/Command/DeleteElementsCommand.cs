using Kit.Core.CQRS.Command;

namespace domain.Element.Command
{
    /// <summary>
    /// Команда. Удалить элементы (из группы)
    /// </summary>
    public class DeleteElementsCommand : AddToFavoritesCommand
    {
        public int GroupId { get; set; }
    }
}
