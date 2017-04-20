using System.Threading.Tasks;
using Kit.Core.CQRS.Command;

namespace domain.Scheme.Command
{
    public class SchemeCommandHandler : 
        ICommandHandlerWithResult<CreateSchemeCommand, long>, 
        ICommandHandlerWithResult<DeleteSchemeCommand, bool>
    {
        public long Execute(CreateSchemeCommand command)
        {
            throw new System.NotImplementedException();
        }

        public Task<long> ExecuteAsync(CreateSchemeCommand command)
        {
            throw new System.NotImplementedException();
        }

        public bool Execute(DeleteSchemeCommand command)
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> ExecuteAsync(DeleteSchemeCommand command)
        {
            throw new System.NotImplementedException();
        }
    }
}
