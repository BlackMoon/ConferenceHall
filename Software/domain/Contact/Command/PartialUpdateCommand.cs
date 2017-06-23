using domain.Common;
using Kit.Core.CQRS.Command;

namespace domain.Contact.Command
{
    /// <summary>
    /// Команда. Частичное обновление контакта (могут задаваться разные свойства)
    /// </summary>
    public class PartialUpdateCommand : KeyObject, ICommand
    {      

        public bool? Active { get; set; }
                
        public string Kind { get; set; }

        public string Address { get; set; }
    }
}
