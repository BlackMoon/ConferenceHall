using System;
using System.Collections.Generic;
using System.Text;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.Employe
{
    [Table("conf_hall.employes")]
    public class Employe : KeyObject, IComponent
    {
        [Column("name")]
        public string Name { get; set; }
        [Column("org_id")]
        public int Org_Id { get; set; }
        [Column("job_title")]
        public bool JobTitle { get; set; }
        [Column("phones_list")]
        public string[] PhonesList { get; set; }
        [Column("emails_list")]
        public string[] EmailsList { get; set; }

    }
}
