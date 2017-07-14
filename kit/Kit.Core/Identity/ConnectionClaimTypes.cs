namespace Kit.Core.Identity
{
    /// <summary>
    /// Типы заявок (claims) для строки соединения (ConnectionString)
    /// </summary>
    public static class ConnectionClaimTypes
    {
        public const string Sid = "sid";

        public const string DataSource = "datasource";

        public const string Password = "password";

        public const string UserId = "name";            // same as JwtClaimTypes.Name
    }
}
