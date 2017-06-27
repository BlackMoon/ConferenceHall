using System;

namespace messengers
{
    /// <summary>
    /// Аттрибут - наименование провайдера
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class SenderKindAttribute : Attribute
    {
        public SenderKindAttribute(string messengerKind, string messengerName = null)
        {
            MessengerKind = messengerKind;
            MessengerName = messengerName;
        }

        public virtual string MessengerKind { get; }

        public virtual string MessengerName { get; }
    }
}