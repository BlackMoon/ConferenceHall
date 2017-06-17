using System.Data;
using System.Linq;
using System.Threading.Tasks;
using domain.Common.Command;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;
using Mapster;
using Microsoft.Extensions.Logging;

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
            throw new System.NotImplementedException();
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
                DbManager.AddParameter("locked", command.User.Locked);
                DbManager.AddParameter("login", command.User.Login);
                DbManager.AddParameter("password", command.User.Password);
                DbManager.AddParameter("role", $"{command.User.Role}::user_role");

                await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "P1");
            }

            // добавить новые контакты
            if (command.Contacts.Any())
            {
                string[] values = new string[command.Contacts.Count];

                for (int i = 0; i < command.Contacts.Count; i++)
                {
                    Contact c = command.Contacts[i];

                    DbManager.AddParameter($"active{i}", c.Active);
                    DbManager.AddParameter($"address{i}", c.Address);
                    DbManager.AddParameter($"kind{i}", c.Kind);
                    DbManager.AddParameter($"employeeId{i}", newId);

                    values[i] = $"(@active{i}, @address{i}, @kind{i}, @employeeId{i})";
                }

                await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.contacts(active, address, kind, employee_id) VALUES {string.Join(", ", values)}");
            }
            DbManager.CommitTransaction();

            return newId;
        }

        public override async Task<bool> ExecuteAsync(Employee command)
        {
            await DbManager.OpenAsync();
            DbManager.BeginTransaction();

            bool updated = await DbManager.DbConnection.UpdateAsync(command);

            // удалить пред. контакты
            DbManager.AddParameter("employeeId", command.Id);
            await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.contacts WHERE employee_id = @employeeId");

            // Привязать/отвязать пользователя
            if (command.User != null)
            {
                DbManager.ClearParameters();

                switch (command.User.Operation)
                {
                    case SysUser.UserOperation.Bind:

                        DbManager.AddParameter("locked", command.User.Locked);
                        DbManager.AddParameter("login", command.User.Login);                        
                        DbManager.AddParameter("password", command.User.Password);
                        DbManager.AddParameter("role", $"{command.User.Role}::user_role");

                        await DbManager.ExecuteNonQueryAsync(CommandType.StoredProcedure, "P1");

                        break;
                    
                    // отвязать пользователя
                    case SysUser.UserOperation.Unbind:

                        DbManager.AddParameter("employeeId", command.Id);
                        await DbManager.ExecuteNonQueryAsync(CommandType.Text, "DELETE FROM conf_hall.users WHERE employee_id = @employeeId");

                        break;
                }

            }

            // добавить новые контакты
            if (command.Contacts.Any())
            {
                string[] values = new string[command.Contacts.Count];

                DbManager.ClearParameters();
                for (int i = 0; i < command.Contacts.Count; i++)
                {
                    Contact c = command.Contacts[i];

                    DbManager.AddParameter($"active{i}", c.Active);
                    DbManager.AddParameter($"address{i}", c.Address);
                    DbManager.AddParameter($"kind{i}", c.Kind);
                    DbManager.AddParameter($"employeeId{i}", command.Id);

                    values[i] = $"(@active{i}, @address{i}, @kind{i}, @employeeId{i})";
                }

                await DbManager.ExecuteNonQueryAsync(CommandType.Text, $"INSERT INTO conf_hall.contacts(active, address, kind, employee_id) VALUES {string.Join(", ", values)}");
            }

            DbManager.CommitTransaction();
            return updated;
        }
    }
}
