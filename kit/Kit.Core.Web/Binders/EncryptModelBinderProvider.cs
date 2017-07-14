using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Kit.Core.Encryption;

namespace Kit.Core.Web.Binders
{
    /// <summary>
    /// Провайдер EncryptModelBinder'a
    /// </summary>
    public class EncryptModelBinderProvider: IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            DefaultModelMetadata metaData = (DefaultModelMetadata) context.Metadata;
            if (metaData.Attributes.Attributes.Any(a => a.GetType() == typeof(EncryptDataTypeAttribute)))
                return new EncryptModelBinder();

            return null;
        }
    }
}
