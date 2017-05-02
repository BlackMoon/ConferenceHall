using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using SkiaSharp;
using System.IO;
using System.Text;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.Element.Command
{
    public class ElementCommandHandler: 
        KeyObjectCommandHandler, 
        ICommandHandler<AddToFavoritesCommand>,
        ICommandHandlerWithResult<CreateElementCommand, long>,
        ICommandHandler<DeleteElementsCommand>
    {
        private const int FavoritesGroupId = 3;

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
            DbManager.AddParameter("scheme_element_group_id", FavoritesGroupId);
            DbManager.AddParameter("userid", command.UserId);

            int i;
            StringBuilder sb = new StringBuilder();
            string commandText;
            if (command.Add)
            {
                commandText = "INSERT INTO conf_hall.scheme_element_locations(scheme_element_id, user_id, scheme_element_group_id) VALUES";
                
                for (i = 0; i < command.Ids.Length - 1; i++)
                {
                    sb.Append($"(@elementid{i}, @userid, @scheme_element_group_id),");
                    DbManager.AddParameter($"@elementid{i}", command.Ids[i]);
                }

                sb.Append($"(@elementid{i}, @userid, @scheme_element_group_id)");
                DbManager.AddParameter($"@elementid{i}", command.Ids[i]);

                commandText += sb;
            }
            else
            {
                commandText = "DELETE FROM conf_hall.scheme_element_locations WHERE scheme_element_id IN (";
                for (i = 0; i < command.Ids.Length - 1; i++)
                {
                    sb.Append($"@elementid{i},");
                    DbManager.AddParameter($"@elementid{i}", command.Ids[i]);
                }

                sb.Append($"@elementid{i})");
                DbManager.AddParameter($"@elementid{i}", command.Ids[i]);

                commandText += sb + " AND user_id = @userid AND scheme_element_group_id = @scheme_element_group_id";
            }

            await DbManager.OpenAsync();

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

        public void Execute(DeleteElementsCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteElementsCommand command)
        {
            DbManager.AddParameter("userid", command.UserId);

            int i;
            StringBuilder sb = new StringBuilder();
            string commandText = "DELETE FROM conf_hall.scheme_element_locations WHERE user_id = @user_id AND scheme_element_id IN (";

            for (i = 0; i < command.Ids.Length - 1; i++)
            {
                sb.Append($"@id{i},");
                DbManager.AddParameter($"@id{i}", command.Ids[i]);
            }

            DbManager.AddParameter($"@id{i}", command.Ids[i]);
            commandText += sb + ")";

            await DbManager.OpenAsync();
            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.Text, commandText);
            _logger.LogInformation($"Modified {returnValue} records");
        }
    }
}
