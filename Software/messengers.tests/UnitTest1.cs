using Xunit;
using Messengers.Email.EmailSend;
using Messengers.Email.Smtpoptions;
using host;
using System;
using System.Threading.Tasks;

namespace Messengers.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void TestEmail()
        {

            // тест отсылки емаил 
            SmtpOptions sConnect = new SmtpOptions();

            sConnect.PasswordSender = "Anapa19811981";
            sConnect.SmtpServer = "smtp.timeweb.ru";
            sConnect.EmailSender = "fiseyskiysv@aquilon-st.ru";
            sConnect.NameSender = "Станислав";
            sConnect.UseSSL = false;
            sConnect.SmtpPort = 25;

           // пример рассылки по списку

            EmailSender es = new EmailSender();
            String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
            es.Recipients = listEmail;
            es.SmtpSettings = sConnect;
          //  es.Send("Заголовок письма", "Письмо приглашает на совещание!");
            Task t = es.SendEmailAsync("Заголовок письма", "Письмо приглашает на совещание!");
            t.Wait();
            
         
        }

        //public void TestEmailAsync()
        //{

        //    // тест отсылки емаил 
        //    SmtpOptions sConnect = new SmtpOptions();

        //    sConnect.PasswordSender = "Anapa19811981";
        //    sConnect.SmtpServer = "smtp.timeweb.ru";
        //    sConnect.EmailSender = "fiseyskiysv@aquilon-st.ru";
        //    sConnect.NameSender = "Станислав";
        //    sConnect.UseSSL = false;
        //    sConnect.SmtpPort = 25;

        //    // пример рассылки по списку

        //    EmailSender es = new EmailSender();
        //    String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
        //    es.Recipients = listEmail;
        //    es.SmtpSettings = sConnect;
        //    Task t = es.SendEmailAsync("Заголовок письма", "Письмо приглашает на совещание!");

        //}


    }


}
