using Dapper;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Microsoft.Extensions.Logging;
using Npgsql;
using System;
using System.Threading.Tasks;

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
            throw new NotImplementedException();
        }

        public async Task<LoginCommandResult> ExecuteAsync(LoginCommand command)
        {
            LoginStatus status = LoginStatus.Success;
            SysUser.SysUser user = null;
            string msg = null;
            
            try
            {
                DynamicParameters param = new DynamicParameters(new { plogin = command.UserName, ppassword = command.Password });

                await DbManager.OpenAsync();
                user = await DbManager.DbConnection.QuerySingleOrDefaultAsync<SysUser.SysUser>("SELECT * FROM conf_hall.user_logon(@plogin, @ppassword)", param);
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

            return new LoginCommandResult() { Message = msg, Status = status, SysUser = user};
        }
    }
}
