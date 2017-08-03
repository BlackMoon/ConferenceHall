using System;
using System.Diagnostics.CodeAnalysis;
using Oracle.DataAccess.Types;

namespace Kit.Dal.Oracle.Udt.TVariantNamedList
{
    /// <summary>
    /// Summary description for TVariantNamedListArrayFactory
    /// </summary>
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public class TVariantNamedListArrayFactory : IOracleArrayTypeFactory
    {

        public Array CreateArray(int numElems)
        {
            return new TVariantNamedList[numElems];
        }

        public Array CreateStatusArray(int numElems)
        {
            return null;
        }
    }
}