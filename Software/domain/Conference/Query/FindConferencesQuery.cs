using System;
using domain.Common.Query;

namespace domain.Conference.Query
{
    /// <summary>
    /// Запрос. Поиск конференция
    /// </summary>
    public class FindConferencesQuery: GetAllQuery
    {
        /// <summary>
        /// Статус конференции
        /// </summary>
        public ConfState State { get; set; }

        /// <summary>
        /// Начальная дата периода
        /// </summary>
        public DateTime Date { get; set; }
    }
}
