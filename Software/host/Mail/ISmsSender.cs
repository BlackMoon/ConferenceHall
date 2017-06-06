using System.Threading.Tasks;

namespace host.SmsSystem
{
    public interface ISmsSender
    {
      Task SendSmsAsync(string number, string message);
    }
}