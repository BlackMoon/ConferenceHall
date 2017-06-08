using System;

namespace messengers
{
    /// <summary>
    /// Аттрибут - наименование провайдера
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class SenderKindAttribute : Attribute
    {
        public SenderKindAttribute(string messengerKind)
        {
            MessengerKind = messengerKind;
        }

        public virtual string MessengerKind { get; }
    }
}