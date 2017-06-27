using System;

namespace messengers.Email
{
    // тип для связи с smtp сервером
    public class SmtpOptions
    {

        /// <summary>
        /// Имя отправителя письма
        /// </summary>
        public string NameSender { get; set; }

        /// <summary>
        /// Почтовый ящик отправителя (с которого отправляется письмо)
        /// </summary>
        public string EmailSender { get; set; }

        /// <summary>
        /// Пароль к почтовому ящику отправителя
        /// </summary>
        public string PasswordSender { get; set; }

        /// <summary>
        /// SMTP сервер
        /// </summary>
        public string SmtpServer { get; set; }

        /// <summary>
        /// Номер SMTP порта на сервере. По умолчанию=25
        /// </summary>
        public int SmtpPort { get; set; } = 25;

        /// <summary>
        /// Булева переменная показывающая, использовать ли шифрование по протоколу SSL при отправке почты
        /// </summary>
        public bool UseSsl { get; set; }
    }
}
