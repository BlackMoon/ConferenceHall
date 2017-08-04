using System.Security.Cryptography;

namespace Kit.Core.Encryption.Symmetric
{
    public class CipherOptions
    {
        // ReSharper disable once InconsistentNaming
        public virtual byte[] IV { get; set; }
        
        /// <summary>
        /// Cipher mode
        /// </summary>
        public CipherMode Mode { get; set; } = CipherMode.CBC;

        /// <summary>
        /// Padding mode
        /// </summary>
        public PaddingMode Padding { get; set; } = PaddingMode.PKCS7;
    }
}
