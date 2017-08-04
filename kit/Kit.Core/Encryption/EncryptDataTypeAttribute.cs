using System;
using System.ComponentModel.DataAnnotations;

namespace Kit.Core.Encryption
{
    /// <summary>
    /// Аттрибут для шифрования значений-полей ViewModel'и
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class EncryptDataTypeAttribute : DataTypeAttribute
    {
        public EncryptDataTypeAttribute(DataType dataType) : base(dataType)
        {
        }

        public EncryptDataTypeAttribute(string customDataType) : base(customDataType)
        {
        }
    }
}
