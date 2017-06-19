﻿using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using MailKit.Net.Smtp;
using MimeKit;
using Newtonsoft.Json;

namespace messengers.Sms
{
    [SenderKind("Sms")]
    public class SmsSender : IMessageSender
    {
        public class CostMessages
        {

            public string Status;
            public string Status_Code;
            public string Total_Cost;
            public string Total_Sms;
        }

        public class BalanceAccount
        {
            public string Balance;
        }

        private readonly SmsOptions _smsSettings;
        private double _totalCost;
        private double _balance;



        public SmsSender(IOptions<SmsOptions> smsOptions)
        {
            _smsSettings = smsOptions.Value;
        }


        public async Task CostAsync(string body, params string[] addresses)
        {
            // Проверить стоимость сообщений перед отправкой один текст на несколько номеров:
            // пример запроса:
            // https://sms.ru/sms/cost?api_id=0F7658A1-2CA5-CF06-00FA-BFF55984B58D&to=79172472533,74993221627&msg=hello+world&json=1


            string recipients = String.Join(",", addresses);
            string bodySmsEncode = System.Net.WebUtility.UrlEncode(body);
            string messageSms = _smsSettings.CostUrl + "api_id=" + _smsSettings.SmsRuApilD + "&to=" + recipients +
                                "&msg=" + bodySmsEncode + "&json=" + _smsSettings.GetJson;

            HttpClient client = new HttpClient();

            try
            {
                HttpResponseMessage response = await client.GetAsync(messageSms);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                CostMessages ss = JsonConvert.DeserializeObject<CostMessages>(responseBody);
                _totalCost = double.Parse(ss.Total_Cost, System.Globalization.CultureInfo.InvariantCulture); 


            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }

            client.Dispose();
        }

        public async Task BalanceAsync()
        {
            // Если вы хотите узнать ваш текущий баланс на счете осуществите этот запрос:
            // https://sms.ru/my/balance?api_id=0F7658A1-2CA5-CF06-00FA-BFF55984B58D&json=1


            string messageRequest = _smsSettings.BalanceUrl + "api_id=" + _smsSettings.SmsRuApilD + "&json=" + _smsSettings.GetJson;

            HttpClient client = new HttpClient();

            try
            {
                HttpResponseMessage response = await client.GetAsync(messageRequest);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                BalanceAccount ba = JsonConvert.DeserializeObject<BalanceAccount>(responseBody);
                _balance = double.Parse(ba.Balance, System.Globalization.CultureInfo.InvariantCulture);

            }
            catch (HttpRequestException e)
            {
                Errors = new List<string> { e.Message };
            }

            client.Dispose();
        }

        public bool CheckSendBalance(string body, params string[] addresses)
        {
            Task t1 = CostAsync(body, addresses);
            t1.Wait();
            Task t2 = BalanceAsync();
            t2.Wait();
            if (_totalCost > _balance)
            {
                return false;
            }

            return true;

        }


        // region генерация сообщения
        public void Send(string subject, string body, params string[] addresses)
        {
            // отправка через письмо на секретный ящик
            // Письма необходимо отправлять на ваш уникальный адрес, который содержит в себе ваш секретный ключ api_id:
            // пример 0F7658A1 - 2CA5 - CF06 - 00FA - BFF55984B58D@sms.ru
            // В заголовке необходимо указать номера получателей: пример 79172472533,74993221627
            string recipients = String.Join(",", addresses);
            var emailMessage = new MimeMessage();


            string email = _smsSettings.SmsRuApilD + _smsSettings.SmsPostDomain;
            emailMessage.To.Add(new MailboxAddress("", email));


            emailMessage.From.Add(new MailboxAddress(_smsSettings.NameSender, _smsSettings.EmailSender));
            emailMessage.Subject = recipients;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                client.Connect(_smsSettings.SmtpServer, _smsSettings.SmtpPort, _smsSettings.UseSSL);
                client.Authenticate(_smsSettings.EmailSender, _smsSettings.PasswordSender);
                client.Send(emailMessage);
                client.Disconnect(true);
            }

        }

        public async Task SendAsync(string subject, string body, params string[] addresses)
        {
            // Отправить СМС сообщение HTTP запросом
            // Если у вас есть необходимость в отправке СМС сообщения из вашей программы, то вы можете отправить следующие запросы на наш сервер.
            // Пример запроса: Отправить  несколько номеров, указанных через запятую:
            // "https://sms.ru/sms/send?api_id=0F7658A1-2CA5-CF06-00FA-BFF55984B58A&to=79172472533,74993221627&msg=hello+world&json=1"


            bool cSend = CheckSendBalance(body, addresses);
            string recipients = String.Join(",", addresses);
            string bodySmsEncode = System.Net.WebUtility.UrlEncode(body);
            string messageRequest = _smsSettings.SendUrl + "api_id=" + _smsSettings.SmsRuApilD + "&to=" + recipients +
                                "&msg=" + bodySmsEncode + "&json=" + _smsSettings.GetJson;

            HttpClient client = new HttpClient();

            try
            {
                HttpResponseMessage response = await client.GetAsync(messageRequest);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();

            }
            catch (HttpRequestException e)
            {
                Errors=new List<string> {e.Message};
            }

            client.Dispose();
        }

        public IEnumerable<string> Errors { get; set; }
    }


}
