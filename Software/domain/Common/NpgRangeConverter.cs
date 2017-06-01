using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NpgsqlTypes;

namespace domain.Common
{
    class NpgsqlRangeConverter<T> : JsonConverter where T: struct
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            NpgsqlRange<T> range = (NpgsqlRange<T>)value;
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
            T? upperBound = null;
            T? lowerBound = null;

            var jObj = JObject.Load(reader);
            
            JToken val;

            if (jObj.TryGetValue("lowerBound", out val))
                lowerBound = val.ToObject<T?>();

            if (jObj.TryGetValue("upperBound", out val))
                upperBound = val.ToObject<T?>();

            return lowerBound.HasValue && upperBound.HasValue ?
                new NpgsqlRange<T>(lowerBound.Value, upperBound.Value) : new NpgsqlRange<T>();
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(NpgsqlRange<>);
        }
    }
}
