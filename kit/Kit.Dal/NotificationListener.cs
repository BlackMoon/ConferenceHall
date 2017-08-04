using System;
using System.Data;
using System.Threading.Tasks;
using Kit.Dal.DbManager;

namespace Kit.Dal
{
    public class NotificationListener
    {
        private static readonly object SyncRoot = new object();
        private static NotificationListener _instance;
        
        public IDbManager DbManager { get; set; }
        
        /// <summary>
        /// Каналы для прослушивания
        /// </summary>
        public string[] Channels { get; set; } = {};

        public Action<object, EventArgs> Notification { get; set; }

        private NotificationListener() { }

        public static NotificationListener Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (SyncRoot)
                    {
                        if (_instance == null)
                        {
                            _instance = new NotificationListener();
                        }
                    }
                }
                return _instance;
            }
        }

        public void Start(bool async)
        {
            if (Channels.Length > 0)
            {
                DbManager.Notification = Notification;
                DbManager.Open();
                
                foreach (string channel in Channels)
                {
                    DbManager.ExecuteNonQuery(CommandType.Text, $"LISTEN {channel}");
                }

                if (async)
                {
                    Task.Run(() =>
                    {
                        while (true)
                        {
                            DbManager.ExecuteNonQuery(CommandType.Text, ";");
                        }
                    });
                }
            }
        }

        public void Stop()
        {
            DbManager.Close();
        }
    }
}
