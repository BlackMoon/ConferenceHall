namespace MessengersContact
{
    public class Contact
    {
        /// <summary>
        /// Вид контакта
        /// </summary>
        /// 
        public Contact()
        {
            Kind = "Sync";
            Address = "phstas2016@rambler.ru;phstas2016@yandex.ru";
        }

        public string Kind { get; set; }

        public string Address { get; set; }
    }
}
