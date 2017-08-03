namespace messengers.Vk
{
    public class VkOptions
    {
        // тип для связи с вконтакте


        /// <summary>
        /// Учетная запись (id) вконтакте с которой отправляется сообщение
        /// </summary>
        public string VkLogin { get; set; }

        /// <summary>
        /// Пароль к учетной записи вконтакте с которой отправляется сообщение
        /// </summary>
        public string VkPassword { get; set; }


        /// <summary>
        /// Для доступа к api вконтакте необходимо зарегистрировать свое приложение
        /// Это id нашего приложения вконтакте
        /// </summary>
        public ulong VkAppId { get; set; }

    }
}
