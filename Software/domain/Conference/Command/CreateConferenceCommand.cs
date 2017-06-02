using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;
using System;
using domain.Common;
using Newtonsoft.Json;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Создание конференции
    /// </summary>
    public class CreateConferenceCommand : ICommand
    {
        [Column("subject")]
        public string Subject { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("hall_id")]
        public int? HallId { get; set; }

        [Column("hall_scheme_id")]
        public int? HallSchemeId { get; set; }

        /// <summary>
        /// Дата начала
        /// </summary>
        public DateTime? StartDate { get; set; }
        
        /// <summary>
        /// Дата окончания
        /// </summary>
        public DateTime? EndDate { get; set; }

    }
}
