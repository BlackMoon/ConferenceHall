using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.Group
{
    /// <summary>
    /// Тип группы
    /// </summary>
    public enum GroupType
    {
        /// <summary>
        /// Глобальные
        /// </summary>
        Global,

        /// <summary>
        /// Мои 
        /// </summary>
        User,

        /// <summary>
        /// Избранное
        /// </summary>
        Favorites
    }

    /// <summary>
    /// Модель. Группа элементов
    /// </summary>
    [Table("conf_hall.scheme_element_groups")]
    public class Group : KeyObject
    {
        public string Name { get; set; }

        public string Icon { get; set; }

        [Column("type")]
        public GroupType GroupType { get; set; }
    }
}
