using Kit.Core.CQRS.Command;

namespace domain.Login.Command
{
    public class LoginCommand : ICommand
    {
        public string UserName { get; set; }

        public string Password { get; set; }
    }
}
