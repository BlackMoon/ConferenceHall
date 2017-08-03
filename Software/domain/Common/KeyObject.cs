using System.ComponentModel.DataAnnotations;

namespace domain.Common
{
    public abstract class KeyObject
    {              
        [Key]
        public int Id { get; set; }        
    }
}
