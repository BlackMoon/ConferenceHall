using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Kit.Core.Web.Binders
{
    /// <summary>
    /// Провайдер InvariantDecimalModelBinder'a
    /// </summary>
    public class InvariantDecimalModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            
            if (!context.Metadata.IsComplexType && 
                    (context.Metadata.ModelType == typeof(decimal) || 
                    context.Metadata.ModelType == typeof(decimal?) || 
                    context.Metadata.ModelType == typeof(double) || 
                    context.Metadata.ModelType == typeof(double?) ||
                    context.Metadata.ModelType == typeof(float) || 
                    context.Metadata.ModelType == typeof(float?))
                )

                return new InvariantDecimalModelBinder(context.Metadata.ModelType);

            return null;
        }
    }
}
