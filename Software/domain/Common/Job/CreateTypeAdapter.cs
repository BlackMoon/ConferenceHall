using System;
using System.Threading.Tasks;
using domain.Hall.Command;
using domain.Scheme.Command;
using Kit.Core.CQRS.Job;
using Mapster;

namespace domain.Common.Job
{
    public class CreateTypeAdapter : IStartupJob
    {
        public void Run()
        {
            #region Hall
            // CreateHallCommand --> Hall
            TypeAdapterConfig<CreateHallCommand, Hall.Hall>
                .ForType();

            // DeleteHallCommand --> Hall
            TypeAdapterConfig<DeleteHallCommand, Hall.Hall>
                .ForType();
            #endregion

            #region Scheme
            // CreateSchemeCommand --> Scheme
            TypeAdapterConfig<CreateSchemeCommand, Scheme.Scheme>
                .ForType()
                .Map(dest => dest.Hall_Id, src => src.HallId);

            // DeleteSchemeCommand --> Scheme
            TypeAdapterConfig<DeleteSchemeCommand, Scheme.Scheme>
                .ForType();
            #endregion
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
