using host.Mail.Smtp;
using messengers.Email;
using Xunit;

namespace messengers.tests
{
    public class EmailSenderTests
    {
        private readonly IEmailSender _emailSender;
        private SmtpConnect _smtpConnect;
        public EmailSenderTests()
        {
            _smtpConnect = new SmtpConnect();    
            _emailSender = new EmailSender();

        }

        [Fact]
        public void TestSend()
        {
            _emailSender.Send("Message", "Body", new [] {"vasya@pupkin.ru"});
            Assert.True(true);
        }
    }
}
