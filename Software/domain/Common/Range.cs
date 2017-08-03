namespace domain.Common
{
    /// <summary>
    /// Интервал
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public struct Range<T> where T: struct
    {
        public T LowerBound { get; set; }

        public T UpperBound { get; set; }
    }
}


