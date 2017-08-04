using Kit.Core.CQRS.Command;

namespace domain.Organization.Command
{
    public class DeleteNodesCommand : ICommand
    {
        public int[] EmployeeIds { get; set; }
        public int[] OrganizationIds { get; set; }
    }
}
