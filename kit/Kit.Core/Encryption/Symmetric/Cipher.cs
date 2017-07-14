using System;
using System.IO;
using System.Security.Cryptography;

namespace Kit.Core.Encryption.Symmetric
{
    public class Cipher : ICipher
    {
        private readonly SymmetricAlgorithm _algorithm;

        public CipherOptions Options
        {
            set
            {
                _algorithm.IV = value.IV;
                _algorithm.Mode = value.Mode;
                _algorithm.Padding = value.Padding;
            }
        }

        public Cipher(SymmetricAlgorithm algorithm)
        {
            _algorithm = algorithm;
        }

        public byte[] Encrypt(string plainText, byte[] key)
        {
            throw new NotImplementedException();
        }

        public string Decrypt(string secureText, byte[] key)
        {
            byte[] secureBytes = Convert.FromBase64String(secureText);
            return Decrypt(secureBytes, key);
        }

        public string Decrypt(byte[] secureBytes, byte[] key)
        {
            string decrypted;

            using (MemoryStream msDecrypt = new MemoryStream(secureBytes))
            {
                ICryptoTransform decryptor = _algorithm.CreateDecryptor(key, _algorithm.IV);

                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        decrypted = srDecrypt.ReadToEnd();
                    }
                }
            }
            
            // for PaddingMode.Zeros
            if (_algorithm.Padding == PaddingMode.Zeros)
                decrypted = decrypted.TrimEnd('\0');

            return decrypted;
        }

        public void Dispose()
        {
            _algorithm.Dispose();
        }
    }
}
