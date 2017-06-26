using domain.Common.Query;

namespace domain.Ticker.Query
{
    /// <summary>
    /// Запрос. Поиск сообщений конференции
    /// </summary>
    public class FindTickersQuery: GetAllQuery
    {
        public int ConferenceId { get; set; }
    }
}
