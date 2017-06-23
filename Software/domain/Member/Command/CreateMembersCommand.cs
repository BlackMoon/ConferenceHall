using System.Collections.Generic;
using Kit.Core.CQRS.Command;

namespace domain.Member.Command
{
    /// <summary>
    /// Команда. Создание участников конференции
    /// </summary>
    public class CreateMembersCommand: ICommand
    {
        public int ConferenceId { get; set; }
        public IList<Member> Members { get; set; }
    }
}
