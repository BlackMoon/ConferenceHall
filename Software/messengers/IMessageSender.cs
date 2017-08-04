using System.Collections.Generic;
using System.Threading.Tasks;

namespace messengers
{
    /// <summary>
    /// Интерфейс message sender'a
    /// </summary>
    public interface IMessageSender
    {
        /// <summary>
        /// Список ошибок
        /// </summary>
        IEnumerable<string> Errors { get; }

        /// <summary>
        /// Оправить сообщение
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="addresses"></param>
        void Send(string subject, string body, params string[] addresses);

        /// <summary>
        /// Отправить сообщение (асинхр.)
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="addresses"></param>
        /// <returns></returns>
        Task SendAsync(string subject, string body, params string[] addresses);
    }
}
