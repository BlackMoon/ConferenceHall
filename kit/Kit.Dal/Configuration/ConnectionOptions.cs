namespace Kit.Dal.Configuration
{
    /// <summary>
    /// Настройки соединения
    /// </summary>
    public class ConnectionOptions
    {
        public int Port { get; set; }        

        public string DataSource { get; set; }

        public string ProviderName { get; set; }

        public string Server { get; set; }
    }
}
