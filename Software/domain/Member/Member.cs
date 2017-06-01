using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace domain.Member
{
    public enum MemberState
    {
        /// <summary>
        /// Планируемая
        /// </summary>
        Invited,

        /// <summary>
        /// На подготовке
        /// </summary>
        Registered
    };


    [Table("conf_hall.employees")]
    public class Member : KeyObject
    {     
        public string Name { get; set; }
                
        [Column("job_title")]
        public string Job_title { get; set; }

        [Column("emails_list")]
        public string[] Emails_list { get; set; }

        [Column("phones_list")]
        public string[] Phones_list { get; set; }

        public string Place { get; set; }

        public string Role { get; set; }

        
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool Locked { get; set; }
    }
}
