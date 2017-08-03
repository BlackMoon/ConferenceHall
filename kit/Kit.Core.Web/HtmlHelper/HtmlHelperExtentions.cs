using System;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

#if NETCOREAPP1_0
using System.Reflection;
#endif

namespace Kit.Core.Web.HtmlHelper
{
    public static class HtmlHelperExtensions
    {
        /// <summary>
        /// Конвертирует c# enum в js enum
        ///  </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="t">Тип enum</param>
        /// <param name="addScriptTags">Добавлять теги &lt;script&gt;&lt;/script&gt;</param>
        /// <returns></returns>
        public static HtmlString EnumToJs(this IHtmlHelper htmlHelper, Type t, bool addScriptTags = false)
        {

#if NETCOREAPP1_0
            if (!t.GetTypeInfo().IsEnum)
                throw new InvalidOperationException("Type is not Enum");
#endif
#if NET46
            if (!t.IsEnum)
                throw new InvalidOperationException("Type is not Enum");
#endif
            StringBuilder sb = new StringBuilder($"var {t.Name} = ");
            sb.AppendLine("{" + string.Join(", ",
                Enum.GetValues(t)
                    .Cast<int>()
                    .Select(v => Enum.GetName(t, v) + ": " + v)) + "};");

            HtmlString htmlString;
            if (addScriptTags)
            {
                TagBuilder link = new TagBuilder("script");
                link.MergeAttribute("type", "text/javascript");
                link.InnerHtml.AppendHtml(sb.ToString());

                var sw = new System.IO.StringWriter();
                link.WriteTo(sw, HtmlEncoder.Default);

                htmlString = new HtmlString(sw.ToString());
            }
            else
                htmlString = new HtmlString(sb.ToString());

            return htmlString;
        }

        /// <summary>
        /// Конвертирует c# строку в js переменную (var {name} = '{value}';)
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="name">Наименование перменной</param>
        /// <param name="value">Значение</param>
        /// <param name="addScriptTags">Добавлять теги &lt;script&gt;&lt;/script&gt;</param>
        /// <returns></returns>
        public static HtmlString ValueToJs(this IHtmlHelper htmlHelper, string name, string value, bool addScriptTags = false)
        {
            HtmlString htmlString = null;
            if (!(string.IsNullOrEmpty(name) || string.IsNullOrEmpty(value)))
            {
                string line = $"var {name} = '{value}';";

                if (addScriptTags)
                {
                    TagBuilder link = new TagBuilder("script");
                    link.MergeAttribute("type", "text/javascript");
                    link.InnerHtml.AppendHtml(line);

                    var sw = new System.IO.StringWriter();
                    link.WriteTo(sw, HtmlEncoder.Default);

                    htmlString = new HtmlString(sw.ToString());
                }
                else
                    htmlString = new HtmlString(line);
            }

            return htmlString;
        }
    }
}
