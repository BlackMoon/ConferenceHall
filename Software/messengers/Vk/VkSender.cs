using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using VkNet;
using VkNet.Enums.Filters;
using VkNet.Model.RequestParams;
using Microsoft.Extensions.Options;

namespace messengers.Vk
{
    [SenderKind("Vk", "ВКонтакте")]
    public class VkSender : IMessageSender
    {
        private readonly VkOptions _vkSettings;

        public VkSender(IOptions<VkOptions> vkOptions)
        {
            _vkSettings = vkOptions.Value;
        }

        public bool VkTemplate(string user)
        {
            Regex myReg = new Regex(@"\d");  // создание регулярного выражения проверки vk_id
            bool result = myReg.IsMatch(user);
            return result;
        }

        // region генерация сообщения
        public void Send(string subject, string body, params string[] addresses)
        {
            var authorize = new ApiAuthParams();
            Settings settings = Settings.Messages; // уровень доступа к данным, Messages=работа с сообщениями
            var vk = new VkApi();
            authorize.Settings = settings;
            authorize.Login = _vkSettings.VkLogin;
            authorize.Password = _vkSettings.VkPassword;
            authorize.ApplicationId = _vkSettings.VkAppId;
            try
            {
                vk.Authorize(authorize); // авторизуемся после чего в vk.Token должен появиться ключ в случае успешной авторизации
            }
            catch (Exception ex)
            {
                _errors.Add("авторизация в vk не прошла. " + ex.Message);
            }
            vk.Authorize(authorize); // авторизуемся после чего в vk.Token должен появиться ключ в случае успешной авторизации
            var mesSend = new MessagesSendParams();
            mesSend.Message = body;
            foreach (var vkid in addresses)
            {
                if (!VkTemplate(vkid))
                {
                    _errors.Add(vkid + " vk_id в неизвестном формате");
                }
                else
                {
                    try
                    {
                        mesSend.UserId = Convert.ToInt64(vkid);
                        var send = vk.Messages.Send(mesSend); //отправляем сообщение
                    }
                    catch (Exception ex)
                    {
                        _errors.Add("vk_id=" + vkid + "не произошла отправка сообщения " + ex.Message);
                    }
                }
            }
        }

        public async Task SendAsync(string subject, string body, params string[] addresses)
        {
            // VkNet все еще не поддерживает асинхронные вызовы напрямую
            //(более того, особого смысла в них нет т.к.у VK есть ограничение на кол-во запросов в секунду)

            var authorize = new ApiAuthParams();
            Settings settings = Settings.Messages; // уровень доступа к данным, Messages=работа с сообщениями
            var vk = new VkApi();
            authorize.Settings = settings;
            authorize.Login = _vkSettings.VkLogin;
            authorize.Password = _vkSettings.VkPassword;
            authorize.ApplicationId = _vkSettings.VkAppId;
            try
            {
                vk.Authorize(authorize); // авторизуемся после чего в vk.Token должен появиться ключ в случае успешной авторизации
            }
            catch (Exception ex)
            {
                _errors.Add("авторизация в vk не прошла. " + ex.Message);
            }
            
            var mesSend = new MessagesSendParams();
            mesSend.Message = body;
            foreach (var vkid in addresses)
            {
                if (!VkTemplate(vkid))
                {
                    _errors.Add(vkid + " vk_id в неизвестном формате");
                }
                else
                {
                    try
                    {
                        mesSend.UserId = Convert.ToInt64(vkid);
                        await Task.Run(() => { var send = vk.Messages.Send(mesSend); });  //отправляем сообщение
                    }
                    catch (Exception ex)
                    {
                        _errors.Add("vk_id=" + vkid + "не произошла отправка сообщения " + ex.Message);
                    }
                }
            }
        }

        private IList<string> _errors = new List<string>();

        public IEnumerable<string> Errors => _errors ?? (_errors = new List<string>());

    }


}

