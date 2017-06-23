using System;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using NpgsqlTypes;

namespace domain.SysUser
{
    /// <summary>
    /// Действия. (Привязать, отвязать) пользователя к сотруднику. pgSql enumeration [user_role]
    /// </summary>
    public enum UserOperation
    {
        None, 

        Bind, 

        Unbind
    }

    /// <summary>
    /// Роль пользователя
    /// </summary>
    public enum UserRole
    {
        User,

        [PgName("poweruser")]
        PowerUser,

        Admin,

        System
    }

    [Table("conf_hall.users")]
    public class SysUser : KeyObject
    {
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool Locked { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }

        [Dapper.Contrib.Extensions.Write(false)]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public UserOperation Operation { get; set; }
       
        public UserRole Role { get; set; }
    }
}
