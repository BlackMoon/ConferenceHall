using Xunit;
using System;
using messengers.Email;
using messengers.Jabber;
using Microsoft.Extensions.Options;
using Moq;
using System.Threading.Tasks;

namespace Messengers.Tests
{
    public class JabberSenderTests
    {
        private readonly Mock<IOptions<JabberOptions>> _jabberMock = new Mock<IOptions<JabberOptions>>();
        private readonly JabberOptions _jabberOptions = new JabberOptions();

        public JabberSenderTests()
        {
            _jabberMock
                .Setup(o => o.Value)
                .Returns(_jabberOptions);
        }

        [Fact]
        public void TestSend()
        {
            JabberSender jb = new JabberSender(_jabberMock.Object);
            String[] listJabberRecipients = { "fiseyskiysv@jabber.aquilon.ru", "fiseyskiysv@jabber.aquilon.ru" };
            jb.Send("", "Приходите на совещание завтра в Татнефти к 12.00", listJabberRecipients);
        }

        [Fact]
        public void TestSendAsync()
        {
            JabberSender jb = new JabberSender(_jabberMock.Object);
            String[] listJabberRecipients = { "fiseyskiysv@jabber.aquilon.ru", "fiseyskiysv@jabber.aquilon.ru" };
            Task t = jb.SendAsync("", "Приходите на совещание завтра в Татнефти к 12.00", listJabberRecipients);
            t.Wait();
        }

    }


}
