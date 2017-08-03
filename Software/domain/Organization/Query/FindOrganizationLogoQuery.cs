namespace domain.Organization.Query
{
    /// <summary>
    /// Запрос. Найти логотип организации
    /// </summary>
    public class FindOrganizationLogoQuery : FindOrganizationByIdQuery
    {
        public bool Icon { get; set; }
    }
}
