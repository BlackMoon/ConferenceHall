using domain.Common.Query;

namespace domain.Member.Query
{
    public class FindMemberByIdQuery : FindObjectByIdQuery
    {
        /// <summary>
        /// Расширяет свойства
        /// </summary>
        public bool FullInfo { get; set; }
    }
}
