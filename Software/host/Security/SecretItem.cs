using Kit.Core.Encryption;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Security.Cryptography;

namespace host.Security
{
    /// <summary>
    /// Единица безопасности
    /// </summary>
    public class SecretItem
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public AlgorithmKind Algorithm { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public CipherMode Mode { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public PaddingMode Padding { get; set; }

        [JsonIgnore]
        public string Password { get; set; }       
      
        public byte[] Key { get; set; }

        // ReSharper disable once InconsistentNaming
        /// <summary>
        /// Initial vector
        /// </summary>
        public byte[] IV { get; set; }
    }
}
