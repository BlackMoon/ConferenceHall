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
        public string Name { get; set; }
        public int Org_Id { get; set; }
        public bool Job_Title { get; set; }
        public string[] PhonesList { get; set; }
        public string[] EmailsList { get; set; }

    }
}
