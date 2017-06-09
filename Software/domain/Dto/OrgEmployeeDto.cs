
using domain.Common;

namespace domain.Dto
{
    /// <summary>
    /// OrgEmployeeDto[Organization, Employee] (выводится в дереве)
    /// </summary>
    public class OrgEmployeeDto : KeyObject
    {
        public bool Locked { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
