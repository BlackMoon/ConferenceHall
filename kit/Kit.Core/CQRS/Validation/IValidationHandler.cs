using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Kit.Core.CQRS.Command;

namespace Kit.Core.CQRS.Validation
{
    public interface IValidationHandler<in TParameter> where TParameter : ICommand
    {
        IEnumerable<ValidationResult> Validate(TParameter command);
    }
}