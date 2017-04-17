using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Employee
{
    [Table("conf_hall.employees")]
    public class Employee : KeyObject
    {
        [Column("name")]
        public string Name { get; set; }
                
        [Column("job_title")]
        public string JobTitle { get; set; }

        [Column("emails_list")]
        public string[] EmailsList { get; set; }

        [Column("phones_list")]
        public string[] PhonesList { get; set; }

        public Organization.Organization Organization { get; set; }
    }
}
