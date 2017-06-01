using System;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace domain.Member
{
    public enum MemberState
    {
        /// <summary>
        /// Приглашен
        /// </summary>
        Invited,

        /// <summary>
        /// Зарегистрирован
        /// </summary>
        Registered,

        /// <summary>
        /// Регистрация подтверждена
        /// </summary>
        Confirmed
    };


    [Table("conf_hall.employees")]
    public class Member : KeyObject
    {
        /// <summary>
        /// Заблокирован? (для пользователей)
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool Locked { get; set; }

        public string Name { get; set; }
                
        [Column("job_title")]
        public string JobTitle { get; set; }

        [Column("emails_list")]
        public string[] EmailsList { get; set; }

        [Column("phones_list")]
        public string[] PhonesList { get; set; }
        
        /// <summary>
        /// Роль (для пользователей)
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Место
        /// </summary>
        public string Seat { get; set; }

        /// <summary>
        /// Статус
        /// </summary>
        public MemberState MemberState { get; set; }

        [Column("state")]
        [JsonIgnore]
        public string State
        {
            set
            {
                MemberState memberState;
                Enum.TryParse(value, true, out memberState);
                MemberState = memberState;
            }
        }

    }
}
