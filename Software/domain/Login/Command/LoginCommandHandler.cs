using System.Data;
using System.Threading.Tasks;
using DryIoc;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Login.Command
{
    public class LoginCommandHandler : ICommandHandlerWithResult<LoginCommand, bool>
    {
        private readonly IDbManager _dbManager;
        public LoginCommandHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
        }

        /// <summary>
        /// Возвращает строку соединения
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public bool Execute(LoginCommand command)
        {
            _dbManager.Open();

            _dbManager.AddParameter("plogin", command.UserName);
            _dbManager.AddParameter("ppassword", command.Password);
            _dbManager.ExecuteNonQuery(CommandType.StoredProcedure, "user_logon");

            return true;
        }

        public async Task<bool> ExecuteAsync(LoginCommand command)
        {
            IDbManagerAsync dbManagerAsync = _dbManager as IDbManagerAsync;

            if (dbManagerAsync != null)
            {
                _dbManager.AddParameter("plogin", command.UserName);
                _dbManager.AddParameter("ppassword", command.Password);

                await dbManagerAsync.OpenAsync();
                await dbManagerAsync.ExecuteNonQueryAsync(CommandType.StoredProcedure, "user_logon");

                return true;
            }
            
            throw new System.NotImplementedException();
        }
    }
}
