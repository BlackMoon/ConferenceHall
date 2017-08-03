using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Kit.Core.Web.Binders
{
    /// <summary>
    /// ModelBinder для дешифрования EncryptedDataType свойств
    /// XOR (value ^ 128)
    /// </summary>
    public class EncryptModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            ValueProviderResult result = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (result != ValueProviderResult.None)
            {
                string value = result.FirstValue;

                // xor decode
                char[] buff = value.ToCharArray();
                for (int i = 0; i < value.Length; ++i)
                {
                    buff[i] = (char)(value[i] ^ 128);
                }

                bindingContext.Result = ModelBindingResult.Success(new string(buff));

            }

            return TaskCache.CompletedTask;
        }
    }
}
