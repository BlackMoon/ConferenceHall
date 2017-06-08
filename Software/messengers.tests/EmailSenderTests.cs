using Xunit;
using System;
using System.Threading.Tasks;
using messengers.Email;
using Microsoft.Extensions.Options;
using Moq;

namespace Messengers.Tests
{
    public class EmailSenderTests
    {
        private readonly Mock<IOptions<SmtpOptions>> _smtpMock = new Mock<IOptions<SmtpOptions>>();
        private readonly SmtpOptions _smtpOptions = new SmtpOptions();

        public EmailSenderTests()
        {
            _smtpMock
                .Setup(o => o.Value)
                .Returns(_smtpOptions);
        }

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

            EmailSender es = new EmailSender(_smtpMock.Object);
            String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
            //es.Recipients = listEmail;
            
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
