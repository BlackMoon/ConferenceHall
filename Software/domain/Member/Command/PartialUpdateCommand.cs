using Kit.Core.CQRS.Command;

namespace domain.Member.Command
{
    /// <summary>
    /// Команда. Частичное обновление участника (могут задаваться разные свойства)
    /// </summary>
    public class PartialUpdateCommand : ICommand
    {
        public int MemberId { get; set; }

        /// <summary>
        /// Статус участника
        /// </summary>
        public MemberState? State { get; set; }

        /// <summary>
        /// Место
        /// </summary>
        public string Seat { get; set; }
    }
}
