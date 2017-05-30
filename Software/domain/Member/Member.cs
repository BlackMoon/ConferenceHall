using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Dapper.Contrib.Extensions;


namespace domain.Member
{
    [System.ComponentModel.DataAnnotations.Schema.Table("conf_hall.employees")]
    public class Member : KeyObject
    {
        [Column("employee_id")]
        [JsonIgnore]
        public int EmployeeId { get; set; }
        [Column("name")]
        public string Name { get; set; }
                
        [Column("job_title")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string JobTitle { get; set; }

        [Column("emails_list")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string[] EmailsList { get; set; }

        [Column("phones_list")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string[] PhonesList { get; set; }

        [Column("role")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string Role { get; set; }
        [Column("locked")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool Locked { get; set; }
    }
}
