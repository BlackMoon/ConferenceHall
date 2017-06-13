using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using CacheManager.Core;
using domain.Common;
using Mapster;
using Microsoft.Extensions.Logging;

namespace domain.Element.Command
{
    public class ElementCommandHandler: 
        KeyObjectCommandHandler<Element>, 
        ICommandHandler<AddToFavoritesCommand>,
        ICommandHandlerWithResult<CreateElementCommand, int>,
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
       

        public ElementCommandHandler(IDbManager dbManager, ILogger<ElementCommandHandler> logger, ICacheManager<Element> cacheManager) : base(dbManager, logger)
        {
            _cacheManager = cacheManager;
        }
    
        public void Execute(AddToFavoritesCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task ExecuteAsync(AddToFavoritesCommand command)
        {
            DbManager.AddParameter("pscheme_element_id", command.Ids);
            DbManager.AddParameter("puser_id", command.UserId);

            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "scheme_element_favorites_add");
            Logger.LogInformation($"Modified {returnValue} records");
        }

        public int Execute(CreateElementCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateElementCommand command)
        {
            Element element = new Element();
            command.Adapt(element);

            element.Data = ImageScaler.ResizeImage(element.Data, MaxW, MaxH, element.MimeType);
            element.Thumbnail = ImageScaler.ResizeImage(element.Data, W, H, element.MimeType, 50);

            await DbManager.OpenAsync();
            int newId = await DbManager.DbConnection.InsertAsync(element);
            
            DbManager.AddParameter("pscheme_element_id", new []{ newId });
            DbManager.AddParameter("puser_id", command.UserId);

            int returnValue = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "scheme_element_user_add");
            Logger.LogInformation($"Modified {returnValue} records");

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
           
            int deleted = await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "scheme_element_location_del");
            Logger.LogInformation($"Modified {deleted} records");

            // clear cache
            foreach (int id in command.Ids)
            {
                _cacheManager.Remove(id.ToString());
            }
        }
        
        public override async Task<bool> ExecuteAsync(Element command)
        {
            command.Data = ImageScaler.ResizeImage(command.Data, MaxW, MaxH, command.MimeType);
            command.Thumbnail = ImageScaler.ResizeImage(command.Data, W, H, command.MimeType, 50);

            await DbManager.OpenAsync();
            await DbManager.DbConnection.UpdateAsync(command);

            // clear cache
            return _cacheManager.Remove(command.Id.ToString());
        }
    }
}
