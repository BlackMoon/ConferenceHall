
namespace domain.Common
{
    /// <summary>
    ///  Узел дерева
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class TreeNode<T> where T : class
    {
        public bool Leaf { get; set; }

        public T Data { get; set; }

        public TreeNode<T>[] Children { get; set; }
    }
}
