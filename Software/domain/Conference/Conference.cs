using System;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace domain.Conference
{
    /// <summary>
    /// Состояние конференции
    /// </summary>
    public enum ConfState
    {
        /// <summary>
        /// Планируемая
        /// </summary>
        Planned,

        /// <summary>
        /// На подготовке
        /// </summary>
        Preparing,

        /// <summary>
        /// Активная
        /// </summary>
        Active,

        /// <summary>
        /// Завершенная
        /// </summary>
        Closed
    };

    [Table("conf_hall.conferences")]
    public class Conference : KeyObject
    {
        public string Subject { get; set; }
     
        public string Description { get; set; }

        [Column("date_start")]
        public DateTime? DateStart { get; set; }

        [Column("date_end")]
        public DateTime? DateEnd { get; set; }
        
        public ConfState ConfState { get; set; }

        [Column("state")]
        [JsonIgnore]
        public string State
        {
            set
            {
                ConfState confState;
                Enum.TryParse(value, true, out confState);
                ConfState = confState;
            }
        }
    }

}
