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

            // ���� ������� ����� 
            SmtpOptions sConnect = new SmtpOptions();

            sConnect.PasswordSender = "Anapa19811981";
            sConnect.SmtpServer = "smtp.timeweb.ru";
            sConnect.EmailSender = "fiseyskiysv@aquilon-st.ru";
            sConnect.NameSender = "���������";
            sConnect.UseSSL = false;
            sConnect.SmtpPort = 25;

           // ������ �������� �� ������

            EmailSender es = new EmailSender();
            String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
            es.Recipients = listEmail;
            es.SmtpSettings = sConnect;
          //  es.Send("��������� ������", "������ ���������� �� ���������!");
            Task t = es.SendEmailAsync("��������� ������", "������ ���������� �� ���������!");
            t.Wait();
            
         
        }

        //public void TestEmailAsync()
        //{

        //    // ���� ������� ����� 
        //    SmtpOptions sConnect = new SmtpOptions();

        //    sConnect.PasswordSender = "Anapa19811981";
        //    sConnect.SmtpServer = "smtp.timeweb.ru";
        //    sConnect.EmailSender = "fiseyskiysv@aquilon-st.ru";
        //    sConnect.NameSender = "���������";
        //    sConnect.UseSSL = false;
        //    sConnect.SmtpPort = 25;

        //    // ������ �������� �� ������

        //    EmailSender es = new EmailSender();
        //    String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
        //    es.Recipients = listEmail;
        //    es.SmtpSettings = sConnect;
        //    Task t = es.SendEmailAsync("��������� ������", "������ ���������� �� ���������!");

        //}


    }


}
