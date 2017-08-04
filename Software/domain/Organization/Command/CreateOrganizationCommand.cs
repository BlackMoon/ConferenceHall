using Kit.Core.CQRS.Command;

namespace domain.Organization.Command
{
    public class CreateOrganizationCommand : ICommand
    {
        public string Address { get; set; }

        public string Code { get; set; }

        public string ContentType { get; set; }

        public string Description { get; set; }

        public byte[] Logo { get; set; }

        public string Name { get; set; }
        
    }
}
