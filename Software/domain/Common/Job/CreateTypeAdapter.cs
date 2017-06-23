using domain.Conference.Command;
using domain.Contact.Command;
using domain.Element.Command;
using domain.Employee.Command;
using domain.Hall.Command;
using domain.Message.Command;
using domain.Organization;
using domain.Organization.Command;
using domain.Scheme.Command;
using Kit.Core.CQRS.Job;
using Mapster;
using System;
using System.Threading.Tasks;

namespace domain.Common.Job
{
    public class CreateTypeAdapter : IStartupJob
    {
        public void Run()
        {
            #region Contact
            // CreateContactCommand --> Contact
            TypeAdapterConfig<CreateContactCommand, Contact.Contact>
                .ForType();
            #endregion

            #region Conference
            // CreateConferenceCommand --> Conference
            TypeAdapterConfig<CreateConferenceCommand, Conference.Conference>
                .ForType();

            // DeleteConferenceCommand --> Conference
            TypeAdapterConfig<DeleteConferenceCommand, Conference.Conference>
                .ForType();
            #endregion

            #region Employee
            // CreateEmployeeCommand --> Employee
            TypeAdapterConfig<CreateEmployeeCommand, Employee.Employee>
                .ForType();
            #endregion

            #region Element
            // CreateSchemeCommand --> Scheme
            TypeAdapterConfig<CreateElementCommand, Element.Element>
                .ForType()
                .Map(dest => dest.MimeType, src => src.ContentType);

            #endregion

            #region Hall
            // CreateHallCommand --> Hall
            TypeAdapterConfig<CreateHallCommand, Hall.Hall>
                .ForType();

            #endregion

            #region Message
            // CreateMessageCommand --> Message
            TypeAdapterConfig<CreateMessageCommand, Message.Message>
                .ForType();
            #endregion

            #region Organization

            // CreateOrganizationCommand --> Organization
            TypeAdapterConfig<CreateOrganizationCommand, Organization.Organization>
                .ForType();

            // Organization --> OrgDtoDto
            TypeAdapterConfig<Organization.Organization, OrgEmployeeDto>
                .ForType()
                .Map(dest => dest.Name, src => src.Code)
                .Map(dest => dest.Description, src => src.Name);

            // Employee --> OrgDto
            TypeAdapterConfig<Employee.Employee, OrgEmployeeDto>
                .ForType()
                .Map(dest => dest.Description, src => src.Position)
                .Map(dest => dest.Locked, src => src.User != null && src.User.Locked );

            #endregion

            #region Scheme
            // CreateSchemeCommand --> Scheme
            TypeAdapterConfig<CreateSchemeCommand, Scheme.Scheme>
                .ForType();
            #endregion
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
