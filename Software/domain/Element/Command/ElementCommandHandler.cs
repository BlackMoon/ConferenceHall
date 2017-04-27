using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using SkiaSharp;
using System.IO;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.Element.Command
{
    public class ElementCommandHandler: 
        KeyObjectCommandHandler, 
        ICommandHandler<AddToFavoritesCommand>,
        ICommandHandlerWithResult<CreateElementCommand, long>
    {
        private readonly ILogger<ElementCommandHandler> _logger;

        public ElementCommandHandler(IDbManager dbManager, ILogger<ElementCommandHandler> logger) : base(dbManager)
        {
            _logger = logger;
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

        public void Execute(AddToFavoritesCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(AddToFavoritesCommand command)
        {
            await DbManager.OpenAsync();

            DbManager.AddParameter("elementid", command.ElementId);
            DbManager.AddParameter("userid", command.UserId);

            string commandText = command.Favorite ? 
                "INSERT INTO conf_hall.scheme_element_favorites(scheme_element_id, user_id) VALUES(@elementid, @userid)" :
                "DELETE FROM conf_hall.scheme_element_favorites WHERE scheme_element_id = @elementid AND user_id = @userid";

            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.Text, commandText);
            _logger.LogInformation($"Modified {returnValue} records");
        }

        public long Execute(CreateElementCommand command)
        {
            throw new NotImplementedException();
        }
        public async Task<long> ExecuteAsync(CreateElementCommand command)
        {
            Element element = new Element();
            command.Adapt(element);

            element.Thumbnail = ResizeImageBySkiaSharp(command.Data, 48);           

            await DbManager.OpenAsync();
            return await DbManager.DbConnection.InsertAsync(element);
        }
    }
}
