using System.Threading.Tasks;

namespace Kit.Core.CQRS.Job
{
    public interface IJobDispatcher
    {
        void Dispatch<TParameter>() where TParameter : IJob;

        Task DispatchAsync<TParameter>() where TParameter : IJob;
    }
}
