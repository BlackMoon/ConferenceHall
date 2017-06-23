using Dapper.Contrib.Extensions;
using domain.Common.Command;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
using System.Threading.Tasks;

namespace domain.Employee.Command
{
    public class EmployeeCommandHandler : 
        KeyObjectCommandHandler<Employee>,
        ICommandHandlerWithResult<CreateEmployeeCommand, int>
    {
        public EmployeeCommandHandler(IDbManager dbManager, ILogger<EmployeeCommandHandler> logger) : base(dbManager, logger)
        {
        }

        public int Execute(CreateEmployeeCommand command)
        {
            throw new NotImplementedException();
        }

        public async Task<int> ExecuteAsync(CreateEmployeeCommand command)
        {
            await DbManager.OpenAsync();
            DbManager.BeginTransaction();

            Employee employee = new Employee();
            int newId = await DbManager.DbConnection.InsertAsync(command.Adapt(employee));

            // Привязать пользователя
            if (command.User != null && command.User.Operation == SysUser.UserOperation.Bind)
            {
                DbManager.AddParameter("pemployee_id", newId);
                DbManager.AddParameter("plocked", command.User.Locked);
                DbManager.AddParameter("plogin", command.User.Login);
                DbManager.AddParameter("ppassword", command.User.Password);
                DbManager.AddParameter("prole", command.User.Role);

                await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "user_save");
            }
            
            DbManager.CommitTransaction();

            return newId;
        }

        public override async Task<bool> ExecuteAsync(Employee command)
        {
            await DbManager.OpenAsync();
            DbManager.BeginTransaction();
            
            bool updated = await DbManager.DbConnection.UpdateAsync(command);            

            // Привязать/отвязать пользователя
            if (command.User != null)
            {
                switch (command.User.Operation)
                {
                    case SysUser.UserOperation.Bind:
                        
                        DbManager.AddParameter("plocked", command.User.Locked);
                        DbManager.AddParameter("plogin", command.User.Login);                        
                        DbManager.AddParameter("ppassword", command.User.Password ?? (object)DBNull.Value);     // пароль может быть пустым
                        DbManager.AddParameter("prole", command.User.Role);

                        await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "user_save");

                        break;
                    
                    // отвязать пользователя
                    case SysUser.UserOperation.Unbind:
                        
                        await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.users WHERE employee_id = @pemployee_id");
                        break;
                }

            }           

            DbManager.CommitTransaction();
            return updated;
        }
    }
}
