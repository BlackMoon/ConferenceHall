using Kit.Core.CQRS.Command;

namespace domain.Contact.Command
{
    public class CreateContactCommand : ICommand
    {      
        public bool Active { get; set; }

        public int EmployeeId { get; set; }

        /// <summary>
        /// Вид контакта
        /// </summary>
        public string Kind { get; set; }

        public string Address { get; set; }
    }
}
