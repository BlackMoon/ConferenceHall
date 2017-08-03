using System.Security.Claims;
using System.Text.RegularExpressions;
// ReSharper disable TooWideLocalVariableScope

namespace Kit.Core.Identity
{
    /// <summary>
    /// Расширение ClaimsPrincipal
    /// </summary>
    public static class ClaimsPrincipalExtentions
    {
        /// <summary>
        /// Форматирование утверждений, связанных с удостоверением
        /// </summary>
        /// <param name="principal"></param>
        /// <param name="format">Строка форматирования, например "User Id={UserId};</param>
        /// <returns></returns>
        public static string ToString(this ClaimsPrincipal principal, string format)
        {
            string result = format;

            Regex rgx = new Regex("{(\\w+)}");
            string newValue, oldValue;

            foreach (Match m in rgx.Matches(format))
            {
                if (m.Groups.Count > 1)
                {
                    oldValue = m.Groups[0].Value;
                    newValue = m.Groups[1].Value;
                    
                    result = result.Replace(oldValue, principal.FindFirst(newValue)?.Value);
                }
            }

            return result;
        }
    }
}
