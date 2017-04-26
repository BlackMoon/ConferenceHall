using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using SkiaSharp;
using System.IO;
using System.Runtime.InteropServices;
using System;


namespace domain.Element.Command
{
    public class ElementCommandHandler: KeyObjectCommandHandler, ICommandHandlerWithResult<Element, long>
    {
        public ElementCommandHandler(IDbManager dbManager) : base(dbManager)
        {
        }

        public long Execute(Element command)
        {
            DbManager.Open();
            return DbManager.DbConnection.Insert(command);
        }

        private byte[] ResizeImageBySkiaSharp(byte[] data, int size)
        {

            using (var ms = new MemoryStream(data))
            {
               
                var inputStream = new SKManagedStream(ms);
                using (var original = SKBitmap.Decode(inputStream))
                {
                    int width, height;
                    if (original.Width > original.Height)
                    {
                        width = size;
                        height = original.Height * size / original.Width;
                    }
                    else
                    {
                        width = original.Width * size / original.Height;
                        height = size;
                    }

                    using (var resized = original
                           .Resize(new SKImageInfo(width, height), SKBitmapResizeMethod.Lanczos3))
                    {
                        if (resized == null) return data;
                        return resized.Bytes;
                    }

                }
            }
        }

        [DllImport(@"urlmon.dll", CharSet = CharSet.Unicode)]
        private extern static System.UInt32 FindMimeFromData(
       System.UInt32 pBC,
       [MarshalAs(UnmanagedType.LPStr)] System.String pwzUrl,
       [MarshalAs(UnmanagedType.LPArray)] byte[] pBuffer,
       System.UInt32 cbSize,
       [MarshalAs(UnmanagedType.LPStr)] System.String pwzMimeProposed,
       System.UInt32 dwMimeFlags,
       out System.UInt32 ppwzMimeOut,
       System.UInt32 dwReserverd
   );

        public static string getMimeType(byte[]  data)
        {           
            try
            {
                System.UInt32 mimetype;
                FindMimeFromData(0, null, data, 256, null, 0, out mimetype, 0);
                System.IntPtr mimeTypePtr = new IntPtr(mimetype);
                string mime = Marshal.PtrToStringUni(mimeTypePtr);
                Marshal.FreeCoTaskMem(mimeTypePtr);
                return mime;
            }
            catch (Exception e)
            {
                return "unknown/unknown";
            }
        }
        public async Task<long> ExecuteAsync(Element command)
        {

            command.Thumbnail = ResizeImageBySkiaSharp(command.Data, 48);
            command.MimeType = getMimeType(command.Data);
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.InsertAsync(command);
        }
    }
}
