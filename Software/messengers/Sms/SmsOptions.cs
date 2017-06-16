using System;
using System.Collections.Generic;
using System.Text;

namespace messengers.Sms
{
    public class SmsOptions
    {

        public SmsOptions()
        {
            SmsRuLogin = "79172472533";
            SmsRuPassword = "Anapa19811981";
            SmsRuApilD = "0F7658A1-2CA5-CF06-00FA-BFF55984B58D";
            SmsPostDomain = "@sms.ru";
            GetJson = "1";
            SendUrl = "https://sms.ru/sms/send?";
            BalanceUrl = "https://sms.ru/my/balance?";
            CostUrl = "https://sms.ru/sms/cost?";
            PasswordSender = "Anapa19811981";
            SmtpServer = "smtp.timeweb.ru";
            EmailSender = "fiseyskiysv@aquilon-st.ru";
            NameSender = "Станислав";
            UseSSL = false;
            SmtpPort = 25;
        }

        public string SmsRuLogin;
        public string SmsRuPassword;
        public string SmsRuApilD;
        public string SmsPostDomain;
        public string GetJson;
        public string SendUrl;
        public string BalanceUrl;
        public string CostUrl;
        public string NameSender;
        public string EmailSender;
        public string PasswordSender;
        public string SmtpServer;
        public Int32 SmtpPort;
        public bool UseSSL;
    }
}
