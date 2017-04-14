using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Npgsql;

namespace domain.Login.Command
{
    public class LoginCommandHandler : ICommandHandlerWithResult<LoginCommand, LoginCommandResult>
    {
        private readonly IDbManager _dbManager;
        private readonly ILogger _logger;

        public LoginCommandHandler(IDbManager dbManager, ILogger<LoginCommandHandler> logger)
        {
            _dbManager = dbManager;
            _logger = logger;
        }

        /// <summary>
        /// Возвращает строку соединения
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public LoginCommandResult Execute(LoginCommand command)
        {
            LoginStatus status = LoginStatus.Success;
            string msg = null;

            try
            {
                _dbManager.AddParameter("plogin", command.UserName);
                _dbManager.AddParameter("ppassword", command.Password);

                _dbManager.Open();
                _dbManager.ExecuteNonQuery(CommandType.StoredProcedure, "user_logon");
            }
            catch (PostgresException ex)
            {
                msg = ex.MessageText;
                status = LoginStatus.Failure;

                _logger.LogError($"{ex.Message}. {ex.Detail}");
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                status = LoginStatus.Failure;

                _logger.LogError(msg);
            }
            finally
            {
                _dbManager.Close();
            }

            return new LoginCommandResult() { Status = status, Message = msg };
        }

        public async Task<LoginCommandResult> ExecuteAsync(LoginCommand command)
        {
            LoginStatus status = LoginStatus.Success;
            string msg = null;

            IDbManagerAsync dbManagerAsync = _dbManager as IDbManagerAsync;

            if (dbManagerAsync != null)
            {
                try
                {
                    _dbManager.AddParameter("plogin", command.UserName);
                    _dbManager.AddParameter("ppassword", command.Password);

                    await dbManagerAsync.OpenAsync();
                    await dbManagerAsync.ExecuteNonQueryAsync(CommandType.StoredProcedure, "conf_hall.user_logon");
                }
                catch (PostgresException ex)
                {
                    msg = ex.MessageText;
                    status = LoginStatus.Failure;

                    _logger.LogError($"{ex.Message}. {ex.Detail}");
                }
                catch (Exception ex)
                {
                    msg = ex.Message;
                    status = LoginStatus.Failure;

                    _logger.LogError(msg);
                }
                finally
                {
                    _dbManager.Close();
                }

                return new LoginCommandResult() { Status = status, Message = msg };
            }
            
            throw new NotImplementedException();
        }
    }
}
