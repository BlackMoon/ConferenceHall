using System;
using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;
using Newtonsoft.Json;

namespace domain.Group
{
    /// <summary>
    /// Тип группы
    /// </summary>
    public enum GroupType
    {
        /// <summary>
        /// Мои 
        /// </summary>
        User,

        /// <summary>
        /// Избранное
        /// </summary>
        Favorites,

        /// <summary>
        /// Глобальные
        /// </summary>
        Global
    }

    /// <summary>
    /// Модель. Группа элементов
    /// </summary>
    [Table("conf_hall.scheme_element_groups")]
    public class Group : KeyObject
    {
        public string Name { get; set; }

        public string Icon { get; set; }

        /// <summary>
        /// Тип группы
        /// </summary>
        public GroupType Type { get; set; }
    }
}
