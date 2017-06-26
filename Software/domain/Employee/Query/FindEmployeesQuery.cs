using domain.Common.Query;

namespace domain.Employee.Query
{
    /// <summary>
    /// Запрос. Поиск сотрудников
    /// </summary>
    public class FindEmployeesQuery : GetAllQuery
    {
        public int? ConferenceId { get; set; }
    }
}
