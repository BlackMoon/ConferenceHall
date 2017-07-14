using System;
using CacheManager.Core;

namespace Kit.Core.Storage
{
    /// <summary>
    /// Интерфейс хранилища
    /// </summary>
    /// <typeparam name="TKey">тип ключ</typeparam>
    /// <typeparam name="TEntity">тип объекта</typeparam>
    public interface IStorage<in TKey, TEntity>
    {
        TEntity Get(TKey key);
        void Set(TKey key, TEntity item);

        void Set(string key, TEntity item, Func<TEntity, TEntity> updateValue);
    }

    /// <summary>
    /// Интерфейс хранилища с истечением срока жизни объектов
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    /// <typeparam name="TEntity"></typeparam>
    public interface IStorageWithExpiration<in TKey, TEntity> : IStorage<TKey, TEntity>
    {
        void Set(TKey key, TEntity item, ExpirationMode mode, TimeSpan timespan);
    }
}
