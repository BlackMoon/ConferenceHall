using System.Threading.Tasks;

namespace Kit.Core.CQRS.Job
{
    /// <summary>
    /// Интерфейс задачи
    /// </summary>
    public interface IJob
    {
        void Run();

        Task RunAsync();
    }
}