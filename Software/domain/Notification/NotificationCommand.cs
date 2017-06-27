using domain.Common.Command;

namespace domain.Notification
{
    /// <summary>
    /// Команда. Уведомление
    /// </summary>
    public class NotificationCommand : GroupCommand
    {
        public string Subject { get; set; }

        public string Body { get; set; }
    }
}
