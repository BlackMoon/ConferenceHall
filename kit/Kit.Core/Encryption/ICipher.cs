using System;

namespace Kit.Core.Encryption
{
    public interface ICipher : IDisposable
    {
        /// <summary>
        /// Зашифровать текст
        /// </summary>
        /// <param name="plainText"></param>
        /// <param name="key">ключ</param>
        /// <returns></returns>
        byte[] Encrypt(string plainText, byte [] key);

        /// <summary>
        /// Расшифровать текст
        /// </summary>
        /// <param name="secureText">base64 текст</param>
        /// <param name="key">ключ</param>
        /// <returns></returns>
        string Decrypt(string secureText, byte [] key);

        /// <summary>
        /// Расшифровать массив байт
        /// </summary>
        /// <param name="secureBytes"></param>
        /// <param name="key">ключ</param>
        /// <returns></returns>
        string Decrypt(byte[] secureBytes, byte[] key);
    }
}