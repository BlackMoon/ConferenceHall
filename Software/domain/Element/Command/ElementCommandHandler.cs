﻿using System;
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
        private const int H = 48;
        private const int W = 48;
        /// <summary>
        ///Максимально допустимые высота и ширина элемента схемы
        /// </summary>
        private const int MaxH = 1024;
        private const int MaxW = 1024;

        private readonly ICacheManager<Element> _cacheManager;
        private readonly ILogger<ElementCommandHandler> _logger;

        public ElementCommandHandler(IDbManager dbManager, ICacheManager<Element> cacheManager, ILogger<ElementCommandHandler> logger) : base(dbManager)
        {
            _cacheManager = cacheManager;
            _logger = logger;
        }

        /// <summary>
        /// Изменяет размер элемента схемы, если isResizeOriginal==true, и эскиза элемента схемы, в противном случае. Размер элемента схемы меняется только если его высота или ширина больше параметров height и width соответственно
        /// </summary>
        /// <param name="element"></param>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <param name="quality"></param>
        private void ResizeImage(bool isResizeOriginal, Element element, int width, int height, int quality = 75)
        {
            if (element.Data == null)
                return;

            using (MemoryStream dataStream = new MemoryStream(element.Data))
            {
                SKManagedStream inputStream = new SKManagedStream(dataStream);
                using (SKBitmap original = SKBitmap.Decode(inputStream))
                {
                    if (!isResizeOriginal||(original.Width > width || original.Height > height))
                    {
                        int w, h;
                        if (original.Width > original.Height)
                        {
                            w = width;
                            h = original.Height * height / original.Width;
                        }
                        else
                        {
                            w = original.Width * width / original.Height;
                            h = height;
                        }

                        using (SKBitmap resized = original.Resize(new SKImageInfo(w, h), SKBitmapResizeMethod.Lanczos3))
                        {
                            if (resized != null)
                            {
                                using (SKImage image = SKImage.FromBitmap(resized))
                                {
                                    SKEncodedImageFormat imageFormat = SKEncodedImageFormat.Bmp;

                                    switch (element.MimeType)
                                    {
                                        case "image/gif":
                                            imageFormat = SKEncodedImageFormat.Gif;
                                            break;

                                        case "image/jpeg":
                                            imageFormat = SKEncodedImageFormat.Jpeg;
                                            break;

                                        case "image/png":
                                            imageFormat = SKEncodedImageFormat.Png;
                                            break;
                                    }
                                    if (isResizeOriginal)
                                        element.Data = image
                                        .Encode(imageFormat, quality)
                                        .ToArray();
                                    else
                                        element.Thumbnail = image
                                        .Encode(imageFormat, quality)
                                        .ToArray();
                                }
                            }
                        }
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
            ResizeImage(true,element, MaxW, MaxH);
            ResizeImage(false,element, W, H);           
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
            ResizeImage(true, command, MaxW, MaxH);
            ResizeImage(false,command, W, H);
            await DbManager.OpenAsync();
            await DbManager.DbConnection.UpdateAsync(command);

            // clear cache
            return _cacheManager.Remove(command.Id.ToString());
        }
    }
}
