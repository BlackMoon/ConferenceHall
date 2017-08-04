using System;
using System.Security.Cryptography;
using Kit.Core.Encryption.Symmetric;
// ReSharper disable InconsistentNaming

namespace Kit.Core.Encryption
{
    /// <summary>
    /// Тип алгоритма
    /// </summary>
    public enum AlgorithmKind { AES, TripleDES }

    /// <summary>
    /// Фабрика шифров
    /// </summary>
    public class CipherFactory
    {
        public static ICipher GetCipher(AlgorithmKind kind)
        {
            return GetCipher(kind, new CipherOptions());
        }

        public static ICipher GetCipher(AlgorithmKind kind, CipherOptions options)
        {
            ICipher cipher;
            switch (kind)
            {
                case AlgorithmKind.AES:
                    cipher = new Cipher(Aes.Create()) { Options = options };
                    break;

                case AlgorithmKind.TripleDES:
                    cipher = new Cipher(TripleDES.Create()) { Options = options };
                    break;

                default:
                    throw new NotSupportedException("Unknown algorithm");
            }

            return cipher;
        }
    }
}
