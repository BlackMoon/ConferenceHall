using domain.Common.Query;

namespace domain.Message.Query
{
    /// <summary>
    /// Запрос. Поиск сообщений конференции
    /// </summary>
    public class FindMessagesQuery: GetAllQuery
    {
        public int ConferenceId { get; set; }
    }
}
