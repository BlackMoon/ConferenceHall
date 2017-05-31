using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace domain.Member
{
    [Table("conf_hall.employees")]
    public class Member : KeyObject
    {     
        public string Name { get; set; }
                
        [Column("job_title")]
        public string JobTitle { get; set; }

        [Column("emails_list")]
        public string[] EmailsList { get; set; }

        [Column("phones_list")]
        public string[] PhonesList { get; set; }

        public string Place { get; set; }

        public string Role { get; set; }

        [Column("locked")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool Locked { get; set; }
    }
}
