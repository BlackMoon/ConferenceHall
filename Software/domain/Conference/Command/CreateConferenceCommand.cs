using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Command;
using System;

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

        //[Column("hall_scheme_id")]
        //public int? HallSchemeId { get; set; }

        [Column("period")]
        public NpgsqlTypes.NpgsqlRange<DateTime> Period { get; set; }

    }
}
