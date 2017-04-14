using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.User
{
    [Table("conf_hall.users")]
    public class SysUser : KeyObject
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public bool Locked { get; set; }
        public string Role { get; set; }
        public int EmployeId { get; set; }
    }
}
