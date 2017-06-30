using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using VkNet;
using VkNet.Enums.Filters;
using VkNet.Model.RequestParams;

namespace messengers.Vk
{
    [SenderKind("Vk", "ВКонтакте")]
    public class VkSender : AbstractSender
    {
        private readonly VkOptions _vkSettings;

        /// <summary>
        /// создание регулярного выражения проверки vk_id
        /// </summary>
        protected new Func<string, bool> AddressValidator = s =>
        {
            Regex rgx = new Regex(@"\d");
            return rgx.IsMatch(s);
        };

        public VkSender(IOptions<VkOptions> vkOptions)
        {
            _vkSettings = vkOptions.Value;
        }

        // region генерация сообщения
        public override void Send(string subject, string body, params string[] addresses)
        {
            if (addresses != null && addresses.Any())
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
                    vk.Authorize(authorize);
                    // авторизуемся после чего в vk.Token должен появиться ключ в случае успешной авторизации
                }
                catch (Exception ex)
                {

                    _errors.Add("авторизация в vk не прошла. " + ex.Message);
                    return;
                }

                MessagesSendParams msp = new MessagesSendParams {Message = body};
                foreach (var vkid in addresses)
                {
                    if (AddressValidator(vkid))
                    {
                        try
                        {
                            msp.UserId = Convert.ToInt64(vkid);
                            vk.Messages.Send(msp); 
                        }
                        catch (Exception ex)
                        {
                            _errors.Add("vk_id=" + vkid + "не произошла отправка сообщения " + ex.Message);
                        }
                    }
                    else
                    {
                        _errors.Add(vkid + " vk_id в неизвестном формате");
                    }
                }
            }
            else
                _errors.Add(" Список адресатов не заполнен. ");
        }

        public override async Task SendAsync(string subject, string body, params string[] addresses)
        {
            // VkNet все еще не поддерживает асинхронные вызовы напрямую
            //(более того, особого смысла в них нет т.к.у VK есть ограничение на кол-во запросов в секунду)
            if (addresses != null && addresses.Any())
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
                    vk.Authorize(authorize);
                    // авторизуемся после чего в vk.Token должен появиться ключ в случае успешной авторизации
                }
                catch (Exception ex)
                {
                    _errors.Add("авторизация в vk не прошла. " + ex.Message);
                    return;
                }

                MessagesSendParams msp = new MessagesSendParams { Message = body };
                foreach (var vkid in addresses)
                {
                    if (AddressValidator(vkid))
                    {
                        try
                        {
                            msp.UserId = Convert.ToInt64(vkid);
                            await Task.Run(() =>
                            {
                                var send = vk.Messages.Send(msp);
                            }); 
                        }
                        catch (Exception ex)
                        {
                            _errors.Add("vk_id=" + vkid + "не произошла отправка сообщения " + ex.Message);
                        }
                    }
                    else
                    {
                        _errors.Add(vkid + " vk_id в неизвестном формате");
                    }
                }
            }
            else
                _errors.Add(" Список адресатов не заполнен. ");
        }

    }


}

