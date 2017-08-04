namespace domain.Login.Command
{
    public class LoginCommandResult
    {
        public LoginStatus Status { get; set; }

        public string Message { get; set; }

        public SysUser.SysUser SysUser { get; set; }
    }
}
