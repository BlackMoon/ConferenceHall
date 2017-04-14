using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.SysUser
{
    [Table("conf_hall.users")]
    public class SysUser : KeyObject
    {
        [Column("login")]
        public string Login { get; set; }

        [Column("role")]
        public string Role { get; set; }
    }
}
