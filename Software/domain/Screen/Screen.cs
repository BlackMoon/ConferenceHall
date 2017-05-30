using System;
using domain.Common;
using Newtonsoft.Json;

namespace domain.Screen
{
    /// <summary>
    /// Модель. Активная конференция (на отдельном экране)
    /// </summary>
    public class Screen
    {
        /// <summary>
        /// Схема svg
        /// </summary>
        public string Plan { get; set; }

        public string Subject { get; set; }

        /// <summary>
        /// Реальная высота, м
        /// </summary>
        public float Height { get; set; }

        /// <summary>
        /// Реальная ширина, м
        /// </summary>
        public float Width { get; set; }

        public Member.Member[] Members { get; set; }

        public string[] Messages { get; set; }

        [JsonConverter(typeof(NpgsqlRangeConverter))]
        public NpgsqlTypes.NpgsqlRange<DateTime> Period { get; set; }
    }
}
