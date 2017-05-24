using System;
using domain.Common.Query;

namespace domain.Conference.Query
{
    /// <summary>
    /// Запрос. Поиск конференций по условиям
    /// </summary>
    public class FindConferencesQuery: GetAllQuery
    {
        /// <summary>
        /// Статус конференции
        /// </summary>
        public ConfState State { get; set; }

        /// <summary>
        /// Конечная дата периода
        /// </summary>
        public DateTime? EndDate { get; set; }

        /// <summary>
        /// Начальная дата периода
        /// </summary>
        public DateTime? StartDate { get; set; }
    }
}
