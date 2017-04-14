using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Employee
{
    [Table("conf_hall.employees")]
    public class Employee : KeyObject, IComponent
    {
        [Column("name")]
        public string Name { get; set; }

        [Column("org_id")]
        public Organization.Organization OrganizationId { get; set; }

        [Column("job_title")]
        public bool JobTitle { get; set; }

        [Column("phones_list")]
        public string[] PhonesList { get; set; }

        [Column("emails_list")]
        public string[] EmailsList { get; set; }

    }
}
