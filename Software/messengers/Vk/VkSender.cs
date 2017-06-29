using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using VkNet;
using VkNet.Enums.Filters;
using VkNet.Model.RequestParams;
using Microsoft.Extensions.Options;
using System.Linq;

namespace messengers.Vk
{
    [SenderKind("Vk", "ВКонтакте")]
    public class VkSender : IMessageSender
    {
        private readonly VkOptions _vkSettings;

        private Lazy<IList<string>> _errors =
           new Lazy<IList<string>>(() => new List<string>());

        public IList<string> ErrorsList
        {
            get { return _errors.Value; }
            set { _errors = new Lazy<IList<string>>(() => value); }
        }


        public IEnumerable<string> Errors => ErrorsList?.AsEnumerable();

        /// <summary>
        /// создание регулярного выражения проверки vk_id
        /// </summary>
        public Func<string, bool> AddressValidator { get; set; } = s =>
        {
            Regex rgx = new Regex(@"\d");
            return rgx.IsMatch(s);
        };

        public VkSender(IOptions<VkOptions> vkOptions)
        {
            _vkSettings = vkOptions.Value;
        }

        // region генерация сообщения
        public void Send(string subject, string body, params string[] addresses)
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

                    ErrorsList.Add("авторизация в vk не прошла. " + ex.Message);
                    return;
                }
                var mesSend = new MessagesSendParams();
                mesSend.Message = body;
                foreach (var vkid in addresses)
                {
                    if (AddressValidator(vkid))
                    {
                        try
                        {
                            mesSend.UserId = Convert.ToInt64(vkid);
                            var send = vk.Messages.Send(mesSend); //отправляем сообщение
                        }
                        catch (Exception ex)
                        {
                            ErrorsList.Add("vk_id=" + vkid + "не произошла отправка сообщения " + ex.Message);
                        }
                    }
                    else
                    {
                        ErrorsList.Add(vkid + " vk_id в неизвестном формате");
                    }
                }
            }
            else
                ErrorsList.Add(" Список адресатов не заполнен. ");
        }

        public async Task SendAsync(string subject, string body, params string[] addresses)
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
                    ErrorsList.Add("авторизация в vk не прошла. " + ex.Message);
                    return;
                }
                var mesSend = new MessagesSendParams();
                mesSend.Message = body;
                foreach (var vkid in addresses)
                {
                    if (AddressValidator(vkid))
                    {
                        try
                        {
                            mesSend.UserId = Convert.ToInt64(vkid);
                            await Task.Run(() =>
                            {
                                var send = vk.Messages.Send(mesSend);
                            }); //отправляем сообщение
                        }
                        catch (Exception ex)
                        {
                            ErrorsList.Add("vk_id=" + vkid + "не произошла отправка сообщения " + ex.Message);
                        }
                    }
                    else
                    {
                        ErrorsList.Add(vkid + " vk_id в неизвестном формате");
                    }
                }
            }
            else

                ErrorsList.Add(" Список адресатов не заполнен. ");
        }


    }


}

