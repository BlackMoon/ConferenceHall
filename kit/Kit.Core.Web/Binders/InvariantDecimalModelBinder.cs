using System;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace Kit.Core.Web.Binders
{
    public class InvariantDecimalModelBinder : IModelBinder
    {
        private readonly SimpleTypeModelBinder _baseBinder;

        public InvariantDecimalModelBinder(Type modelType)
        {
            _baseBinder = new SimpleTypeModelBinder(modelType);
        }

        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

            if (valueProviderResult != ValueProviderResult.None)
            {
                bindingContext.ModelState.SetModelValue(bindingContext.ModelName, valueProviderResult);

                var valueAsString = valueProviderResult.FirstValue;

                switch (Type.GetTypeCode(bindingContext.ModelType))
                {
                    case TypeCode.Double:

                        double doubleResult;
                        // Use invariant culture
                        if (double.TryParse(valueAsString, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out doubleResult))
                        {
                            bindingContext.Result = ModelBindingResult.Success(doubleResult);
                            return Task.CompletedTask;
                        }

                        break;

                    case TypeCode.Single:

                        float floatResult;
                        // Use invariant culture
                        if (float.TryParse(valueAsString, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out floatResult))
                        {
                            bindingContext.Result = ModelBindingResult.Success(floatResult);
                            return Task.CompletedTask;
                        }

                        break;

                    default:

                        decimal decimalResult;
                        // Use invariant culture
                        if (decimal.TryParse(valueAsString, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimalResult))
                        {
                            bindingContext.Result = ModelBindingResult.Success(decimalResult);
                            return Task.CompletedTask;
                        }

                        break;
                }
            }

            // If we haven't handled it, then we'll let the base SimpleTypeModelBinder handle it
            return _baseBinder.BindModelAsync(bindingContext);
        }
    }
}
