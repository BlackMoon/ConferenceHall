using System;

namespace domain.Screen
{
    /// <summary>
    /// Модель. Активная конференция (на отдельном экране)
    /// </summary>
    public class Screen
    {
        /// <summary>
        /// id схемы svg
        /// </summary>
        public int SchemeId { get; set; }

        public string Subject { get; set; }
        
        /// <summary>
        /// Сообщения бегущей строки
        /// </summary>
        public string[] Tickers { get; set; }

        /// <summary>
        /// Дата/время начала
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Дата/время окончания
        /// </summary>
        public DateTime EndDate { get; set; }
    }
}
