using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.SysUser
{
    /// <summary>
    /// Роль пользователя
    /// </summary>
    public enum UserRole
    {
        User,

        PowerUser,

        Admin,

        System
    }

    [Table("conf_hall.users")]
    public class SysUser : KeyObject
    {
        public bool Locked { get; set; }

        public string Login { get; set; }
        
        public UserRole Role { get; set; }
    }
}
