using Kit.Core.CQRS.Command;

namespace domain.Common.Command
{
    /// <summary>
    /// Команда мульти-обработки записей
    /// </summary>
    public class GroupCommand : ICommand
    {
        /// <summary>
        /// id элементов
        /// </summary>
        public int[] Ids { get; set; }
    }
}
