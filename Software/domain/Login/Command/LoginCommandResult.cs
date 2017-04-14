using System;
using System.Collections.Generic;
using System.Text;

namespace domain.Login.Command
{
    public class LoginCommandResult
    {
        public LoginStatus Status { get; set; }

        public string Message { get; set; }
    }
}
