using System;

namespace Kit.Core
{
    /// <summary>
    /// Игнорировать тип при регистрации в IoC-контейнере
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class IgnoreRegistrationAttribute : Attribute
    {
    }
}
