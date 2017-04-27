using Kit.Core.CQRS.Command;

namespace domain.Element.Command
{
    public class CreateElementCommand : ICommand
    {
        public string ContentType { get; set; } = "image/*";

        /// <summary>
        /// Наименование
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Эскиз
        /// </summary>
        public byte[] Data { get; set; }
        

        /// <summary>
        /// Реальная высота, м
        /// </summary>
        public float Height { get; set; }

        /// <summary>
        /// Реальная ширина, м
        /// </summary>
        public float Width { get; set; }
    }
}
