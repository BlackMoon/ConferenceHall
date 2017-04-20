using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;

namespace domain.Hall.Command
{
    /// <summary>
    /// Команда. Создание конференц-холла
    /// </summary>
    public class CreateHallCommand : ICommand
    {
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }
    }
}
