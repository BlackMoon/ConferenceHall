using System;


namespace messengers.Sms
{
    public class SmsOptions
    {
        // тип для отправки смс
        public string SmsRuLogin { get; set; }

        public string SmsRuPassword { get; set; }

        public string SmsRuApilD { get; set; }

        public string SmsPostDomain { get; set; }

        public string GetJson { get; set; }

        public string SendUrl { get; set; }

        public string BalanceUrl { get; set; }

        public string CostUrl { get; set; }

        public string NameSender { get; set; }

        public string EmailSender { get; set; }

        public string PasswordSender { get; set; }

        public string SmtpServer { get; set; }

        public Int32 SmtpPort { get; set; }

        public bool UseSsl { get; set; }

    }
}
