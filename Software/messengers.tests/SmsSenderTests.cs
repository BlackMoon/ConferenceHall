using Xunit;
using System;
using messengers.Sms;
using Microsoft.Extensions.Options;
using Moq;
using System.Threading.Tasks;

namespace Messengers.Tests
{
    public class SmsSenderTests
    {
        private readonly Mock<IOptions<SmsOptions>> _smsMock = new Mock<IOptions<SmsOptions>>();
        private readonly SmsOptions _smsOptions = new SmsOptions();

        public SmsSenderTests()
        {
            _smsMock
                .Setup(o => o.Value)
                .Returns(_smsOptions);
        }

        [Fact]

        // проверка синхронной рассылки смс
        //public void TestSendSync()
        //{
        //    SmsSender sms = new SmsSender(_smsMock.Object);
        //    String[] listSmsRecipients = { "79003224426", "79172472533" };
        //    sms.Send("", "Синхр.метод. Совещание в Татнефти в 10.00 20.06.2017", listSmsRecipients);
        //}

        // проверка асинхронной рассылки смс
        public void TestSendAsync()
        {
            SmsSender sms = new SmsSender(_smsMock.Object);
            String[] listSmsRecipients = { "79003224426", "79172472533" };
            Task t = sms.SendAsync("", "Асинхр.метод. Совещание в Татнефти в 10.00 17.06.2017", listSmsRecipients);
            t.Wait();
        }

        // асинхронная проверка стоимости сообщений
        //public void TestCostAsync()
        //{
        //SmsSender sms = new SmsSender(_smsMock.Object);
        //String[] listSmsRecipients = { "79003224426", "79172472533" };
        //Task t = sms.CostAsync("Асинхр.метод. Совещание в Татнефти в 10.00 17.06.2017", listSmsRecipients);
        //t.Wait();
        //}

    }


}
