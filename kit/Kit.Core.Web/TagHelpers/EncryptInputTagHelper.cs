using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Kit.Core.Encryption;

namespace Kit.Core.Web.TagHelpers
{
    /// <summary>
    /// TagHelper. Добавляет html-аттрибут [data-encrypt=true] свойству с аттрибутом EncryptDataTypeAttribute.
    /// </summary>
    [HtmlTargetElement("input", Attributes = "asp-for", TagStructure = TagStructure.WithoutEndTag)]
    public class EncryptInputTagHelper : InputTagHelper
    {
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            base.Process(context, output);

            DefaultModelMetadata meta = (DefaultModelMetadata)For?.Metadata;
            if (meta != null &&
                meta.Attributes.PropertyAttributes.Any(a => a.GetType() == typeof(EncryptDataTypeAttribute)))
                output.Attributes.Add("data-encrypt", "true");

        }

        public EncryptInputTagHelper(IHtmlGenerator generator) : base(generator)
        {
        }
    }
}
