using System.Threading.Tasks;
using Kit.Core.CQRS.Job;

namespace Kit.Core.Web.Job
{
    public class AddMapperConfiguration : IStartupJob
    {
        public void Run()
        {
        }

        public Task RunAsync()
        {
            throw new System.NotImplementedException();
        }
    }
}
