using domain.Common;
using Newtonsoft.Json;

namespace domain.Organization
{
    /// <summary>
    /// OrgEmployeeDto[Organization, Employee] (выводится в дереве)
    /// </summary>
    public class OrgEmployeeDto : KeyObject
    {
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool Locked { get; set; }
        
        public string Name { get; set; }

        public string Description { get; set; }
    }

    /// <summary>
    /// Узел дерева организаций
    /// </summary>
    public class OrganizationNode : TreeNode<OrgEmployeeDto>
    {
    }
}
