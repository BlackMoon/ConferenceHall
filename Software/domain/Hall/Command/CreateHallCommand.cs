using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;

namespace domain.Hall.Command
{
    public class CreateHallCommand : ICommand
    {
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }
    }
}
