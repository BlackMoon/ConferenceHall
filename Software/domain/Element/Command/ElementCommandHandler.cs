using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using SkiaSharp;
using System.IO;


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
        public async Task<long> ExecuteAsync(Element command)
        {

           // command.Thumbnail = ResizeImageBySkiaSharp(command.Data,  command.Width)
           
            await DbManager.OpenAsync();
            return await DbManager.DbConnection.InsertAsync(command);
        }
    }
}
