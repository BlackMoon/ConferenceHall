using System;
using domain.Common;
using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;
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
    public class Conference : KeyObject, ICommand
    {
        [Column("hall_id")]
        public int? HallId { get; set; }

        [Column("hall_scheme_id")]
        public int? HallSchemeId { get; set; }

        /// <summary>
        /// Дата/время начала
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Дата/время окончания
        /// </summary>
        public DateTime EndDate { get; set; }

        public string Subject { get; set; }
     
        public string Description { get; set; }

        public ConfState ConfState { get; set; }
        
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
