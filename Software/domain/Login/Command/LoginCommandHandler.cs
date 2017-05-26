using System;
using System.Data;
using System.Threading.Tasks;
using domain.Common.Command;
using Microsoft.Extensions.Logging;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Npgsql;

namespace domain.Login.Command
{
    public class LoginCommandHandler : KeyObjectCommandHandler, ICommandHandlerWithResult<LoginCommand, LoginCommandResult>
    {
        public LoginCommandHandler(IDbManager dbManager, ILogger<LoginCommandHandler> logger) : base(dbManager, logger)
        {
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
                DbManager.AddParameter("plogin", command.UserName);
                DbManager.AddParameter("ppassword", command.Password);

                DbManager.Open();
                DbManager.ExecuteNonQuery(CommandType.StoredProcedure, "user_logon");
            }
            catch (PostgresException ex)
            {
                msg = ex.MessageText;
                status = LoginStatus.Failure;

                Logger.LogError($"{ex.Message}. {ex.Detail}");
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                status = LoginStatus.Failure;

                Logger.LogError(msg);
            }
            finally
            {
                DbManager.Close();
            }

            return new LoginCommandResult() { Status = status, Message = msg };
        }

        public async Task<LoginCommandResult> ExecuteAsync(LoginCommand command)
        {
            LoginStatus status = LoginStatus.Success;
            string msg = null;

            
            try
            {
                DbManager.AddParameter("plogin", command.UserName);
                DbManager.AddParameter("ppassword", command.Password);
               
                await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "conf_hall.user_logon");
            }
            catch (PostgresException ex)
            {
                msg = ex.MessageText;
                status = LoginStatus.Failure;

                Logger.LogError($"{ex.Message}. {ex.Detail}");
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                status = LoginStatus.Failure;

                Logger.LogError(msg);
            }
            finally
            {
                DbManager.Close();
            }

            return new LoginCommandResult() { Status = status, Message = msg };
        }
    }
}
