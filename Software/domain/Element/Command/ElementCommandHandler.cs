using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using SkiaSharp;
using System.IO;
using CacheManager.Core;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.Element.Command
{
    public class ElementCommandHandler: 
        KeyObjectCommandHandler, 
        ICommandHandler<AddToFavoritesCommand>,
        ICommandHandlerWithResult<CreateElementCommand, int>,
        ICommandHandlerWithResult<Element, bool>, 
        ICommandHandler<DeleteElementsCommand>
    {
        private readonly ICacheManager<Element> _cacheManager;
        private readonly ILogger<ElementCommandHandler> _logger;

        public ElementCommandHandler(IDbManager dbManager, ICacheManager<Element> cacheManager, ILogger<ElementCommandHandler> logger) : base(dbManager)
        {
            _cacheManager = cacheManager;
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
            DbManager.AddParameter("pscheme_element_id", command.Ids);
            DbManager.AddParameter("puser_id", command.UserId);

            await DbManager.OpenAsync();

            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "scheme_element_favorites_add");
            _logger.LogInformation($"Modified {returnValue} records");
        }

        public int Execute(CreateElementCommand command)
        {
            throw new NotImplementedException();
        }
        public async Task<int> ExecuteAsync(CreateElementCommand command)
        {
            Element element = new Element();
            command.Adapt(element);

            element.Thumbnail = ResizeImageBySkiaSharp(command.Data, 48);           

            await DbManager.OpenAsync();
            int newId = await DbManager.DbConnection.InsertAsync(element);
            
            DbManager.AddParameter("pscheme_element_id", new []{ newId });
            DbManager.AddParameter("puser_id", command.UserId);

            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "scheme_element_user_add");
            _logger.LogInformation($"Modified {returnValue} records");

            return newId;
        }

        public void Execute(DeleteElementsCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(DeleteElementsCommand command)
        {
            DbManager.AddParameter("pscheme_element_id", command.Ids);
            DbManager.AddParameter("pscheme_element_group_id", command.GroupId);
            DbManager.AddParameter("puser_id", command.UserId);

            await DbManager.OpenAsync();
            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "scheme_element_location_del");
            _logger.LogInformation($"Modified {returnValue} records");

            // clear cache
            foreach (int id in command.Ids)
            {
                _cacheManager.Remove(id.ToString());
            }
        }

        public bool Execute(Element command)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExecuteAsync(Element command)
        {
            command.Thumbnail = command.Data;

            await DbManager.OpenAsync();
            await DbManager.DbConnection.UpdateAsync(command);

            // clear cache
            return _cacheManager.Remove(command.Id.ToString());
        }
    }
}
