using System;
using CacheManager.Core;
using Kit.Core.Storage;

namespace host.Security
{
    /// <summary>
    /// Хранилище секретов
    /// </summary>
    public class SecretStorage : IStorage<string, SecretItem>
    {
        private const string Region = "Secret";

        private readonly ICacheManager<SecretItem> _cacheManager;

        public SecretStorage(ICacheManager<SecretItem> cacheManager)
        {
            _cacheManager = cacheManager;
        }

        public SecretItem Get(string key) => _cacheManager.Get(key, Region);

        public void Set(string key, SecretItem item) => _cacheManager.Put(key, item, Region);

        public void Set(string key, SecretItem item, Func<SecretItem, SecretItem> updateValue) => _cacheManager.AddOrUpdate(key, item, updateValue);
    }
}
