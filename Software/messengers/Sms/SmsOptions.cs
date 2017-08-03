using System;


namespace messengers.Sms
{
    public class SmsOptions
    {
        // тип для отправки смс

        /// <summary>
        /// Отправка смс реализована через провайдера https://sms.ru
        /// Сообщение до них мы можем отправить одним из двух путей:
        /// 1) Отправив https запрос определенного вида
        /// 2) Отправив email определенного вида на их почтовый ящик
        /// </summary>

        /// <summary>
        /// Логин нашей учетной записи на sms.ru. (Совпадает с телефоном с которого отправляется смс)
        /// </summary>
        public string SmsRuLogin { get; set; }

        /// <summary>
        /// Пароль к нашей учетной записи на sms.ru
        /// </summary>
        public string SmsRuPassword { get; set; }

        /// <summary>
        /// Идентификатор нашей учетной записи на sms.ru в шестандцатиричном виде
        /// </summary>
        public string SmsRuApilD { get; set; }

        /// <summary>
        /// Домен sms.ru куда мы направляем письмо
        /// </summary>
        public string SmsPostDomain { get; set; }

        /// <summary>
        /// Параметр возвращения json ответа при отправке https запроса на sms.ru
        /// Для получения ответа параметр должен иметь значение  равное 1
        /// </summary>
        public string GetJson { get; set; }

        /// <summary>
        /// URL для отправки https запроса на отсылку смс
        /// </summary>
        public string SendUrl { get; set; }

        /// <summary>
        /// URL для отправки https запроса узнать баланс нашего лицевого счета
        /// </summary>
        public string BalanceUrl { get; set; }

        /// <summary>
        /// URL для отправки https запроса узнать стоимость отправки смс
        /// </summary>
        public string CostUrl { get; set; }

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
        public Int32 SmtpPort { get; set; }

        /// <summary>
        /// Булева переменная показывающая, использовать ли шифрование по протоколу SSL при отправке почты
        /// </summary>
        public bool UseSsl { get; set; }

    }
}
