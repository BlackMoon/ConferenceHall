using System;
using domain.Common;
using domain.Conference;

namespace domain.Screen
{
    /// <summary>
    /// Модель. Активная конференция (на отдельном экране)
    /// </summary>
    public class Screen : KeyObject
    {
        public string Hall { get; set; }

        public string Subject { get; set; }

        public ConfState? State { get; set; }

        /// <summary>
        /// id схемы svg
        /// </summary>
        public int? SchemeId { get; set; }
        
        /// <summary>
        /// Дата/время начала
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Дата/время окончания
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Сообщения бегущей строки
        /// </summary>
        public string[] Tickers { get; set; }
    }
}
