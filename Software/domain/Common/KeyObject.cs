using System.ComponentModel.DataAnnotations;

namespace domain.Common
{
    public abstract class KeyObject
    {              
        [Key]
        public int Id { get; set; }

        public override int GetHashCode()
        {
            // ReSharper disable once NonReadonlyMemberInGetHashCode
            return Id.GetHashCode();
        }
    }
}
