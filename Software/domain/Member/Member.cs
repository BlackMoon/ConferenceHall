using System;
using System.Collections.Generic;
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
        public string Name { get; set; }

        public int LockedInt { get; set; }
        
        /// <summary>
        /// Заблокирован? (для пользователей)
        /// </summary>
       
        [Column("locked")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        [JsonIgnore]
        public bool Locked
        {
            set
            {
                LockedInt = value ? 1 : 0;
            }
        }
        

        [Column("job_title")]
        public string JobTitle { get; set; }

        /// <summary>
        /// Роль (для пользователей)
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Место
        /// </summary>
        public string Seat { get; set; }
        public IList<Contact.Contact> Contacts { get; set; }

        /// <summary>
        /// Статус
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
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
