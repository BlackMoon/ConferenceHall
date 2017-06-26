using domain.Common.Command;

namespace domain.Notification
{
    /// <summary>
    /// Команда. Уведомление
    /// </summary>
    public class Notification : GroupCommand
    {
        public string Subject { get; set; }

        public string Body { get; set; }
    }
}
