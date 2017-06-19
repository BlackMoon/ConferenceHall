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
        public void TestSend()
        {
            EmailSender es = new EmailSender(_smtpMock.Object);
            String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
            es.Send("Заголовок письма Sync", "Письмо приглашает на совещание Sync!", listEmail);
        }

        [Fact]
        public void TestSendAsync()
        {
            EmailSender es = new EmailSender(_smtpMock.Object);
            String[] listEmail = { "phstas2016@rambler.ru", "phstas2016@yandex.ru" };
            Task t = es.SendAsync("Заголовок письма Async", "Письмо приглашает на совещание Async!", listEmail);
            t.Wait();
        }


    }


}
