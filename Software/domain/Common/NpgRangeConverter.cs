using System;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NpgsqlTypes;

namespace domain.Common
{
    class NpgsqlRangeConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            NpgsqlRange<DateTime> range = (NpgsqlRange<DateTime>)value;
            if (range.IsEmpty)
            {
                serializer.Serialize(writer, null);
                return;
            }

            writer.WriteStartObject();

            writer.WritePropertyName("lowerBound");
            serializer.Serialize(writer, range.LowerBound);

            writer.WritePropertyName("upperBound");
            serializer.Serialize(writer, range.UpperBound);

            writer.WriteEndObject();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {

            JObject jObject = JObject.Load(reader);

            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(NpgsqlRange<>);
        }
    }
}
