using Xunit;
using System;
using System.Threading.Tasks;
using messengers.Vk;
using Microsoft.Extensions.Options;
using Moq;

namespace Messengers.Tests
{
    public class VkSenderTests
    {
        private readonly Mock<IOptions<VkOptions>> _vkMock = new Mock<IOptions<VkOptions>>();
        private readonly VkOptions _vkOptions = new VkOptions();

        public VkSenderTests()
        {
            _vkMock
                .Setup(o => o.Value)
                .Returns(_vkOptions);
        }

        [Fact]
        public void TestSend()
        {
            VkSender vks = new VkSender(_vkMock.Object);
            String[] listVkUserId = { "4028926", "4028926" };
            vks.Send("", "Письмо приглашает на совещание в Татнефть!", listVkUserId);
        }

        [Fact]
        public void TestSendAsync()
        {
            VkSender vks = new VkSender(_vkMock.Object);
            String[] listVkUserId = { "4028926", "4028926" };
            Task t = vks.SendAsync("", "Письмо приглашает на совещание в Татнефть! Async!", listVkUserId);
            t.Wait();
        }


    }


}
