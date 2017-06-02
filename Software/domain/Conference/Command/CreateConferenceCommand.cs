using Kit.Core.CQRS.Command;
using System;

namespace domain.Conference.Command
{
    /// <summary>
    /// Команда. Создание конференции
    /// </summary>
    public class CreateConferenceCommand : ICommand
    {
        public string Subject { get; set; }
       
        public string Description { get; set; }
     
        public int? HallId { get; set; }
     
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
