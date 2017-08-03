using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace Kit.Core.Web.Mvc
{
    public static class ControllerExtensions
    {
        public static string RenderPartialViewToString(this Controller controller, string viewName)
        {
            return controller.RenderPartialViewToString(viewName, null);
        }

        /// <summary>
        /// Render view в строку
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="viewName"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public static string RenderPartialViewToString(this Controller controller, string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
                viewName = controller.ControllerContext.ActionDescriptor.ActionName;

            controller.ViewData.Model = model;

            using (StringWriter sw = new StringWriter())
            {
                /*ICompositeViewEngine engine = controller.Resolver.GetService<ICompositeViewEngine>();
                ViewEngineResult viewResult = engine.FindView(controller.ActionContext, viewName);

                ViewContext viewContext = new ViewContext(controller.ActionContext, viewResult.View, controller.ViewData, controller.TempData, sw, new HtmlHelperOptions());
                Task task = viewResult.View.RenderAsync(viewContext);
                task.Wait();*/

                return sw.GetStringBuilder().ToString();
            }
        }
    }
}
