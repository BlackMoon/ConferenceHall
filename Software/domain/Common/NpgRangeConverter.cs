using System;
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
            var jObj = JObject.Load(reader);
            DateTime? upperBound = null;
            DateTime? lowerBound = null;
            JToken val;
            if(jObj.TryGetValue("lowerBound", out val))
                lowerBound = val.ToObject<DateTime?>();
            if (jObj.TryGetValue("upperBound", out val))
                upperBound = val.ToObject<DateTime?>();

            return lowerBound.HasValue && upperBound.HasValue ?
                new NpgsqlRange<DateTime>(lowerBound.Value, upperBound.Value) : new NpgsqlRange<DateTime>();
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(NpgsqlRange<>);
        }
    }
}
