using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kit.Dal.DbManager;
using Npgsql;

namespace Kit.Dal.Postgre
{
    [ProviderName("Npgsql")]
    public class PostgreDbManager : IDbManager
    {
        private bool _wasClosed;

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            Close();
            
            _dbConnection = null;
        }

        public string ConnectionString { get; set; }

        /// <summary>
        /// DbConnection
        /// </summary>
        private NpgsqlConnection _dbConnection;

        public IDbConnection DbConnection => _dbConnection = _dbConnection ?? new NpgsqlConnection();

        public IDbTransaction Transaction { get; private set; }

        public IDataReader DataReader { get; private set; }
        
        public IDbCommand DbCommand { get; private set; }

        private readonly IList<NpgsqlParameter> _dbParameters = new List<NpgsqlParameter>();

        // ReSharper disable once CoVariantArrayConversion
        public IDbDataParameter[] DbParameters => _dbParameters.ToArray();

        public  Action<string> Log { get; set; }

        public Action<object, EventArgs> Notification { get; set; }

        public void AddParameter(IDbDataParameter dataParameter)
        {
            _dbParameters.Add((NpgsqlParameter)dataParameter);
        }

        public IDbDataParameter AddParameter(string name)
        {
            NpgsqlParameter p = new NpgsqlParameter()
            {
                ParameterName = name                
            };

            _dbParameters.Add(p);
            return p;
        }

        public IDbDataParameter AddParameter(string name, DbType dbType)
        {
            NpgsqlParameter p = (NpgsqlParameter)AddParameter(name);
            p.DbType = dbType;
            return p;
        }

        public IDbDataParameter AddParameter(string name, object value)
        {
            NpgsqlParameter p = (NpgsqlParameter)AddParameter(name);
            p.Value = value;
            return p;
        }

        public IDbDataParameter AddParameter(string name, DbType dbType, object value)
        {
            NpgsqlParameter p = (NpgsqlParameter)AddParameter(name, dbType);
            p.Value = value;
            return p;
        }

        public IDbDataParameter AddParameter(string name, DbType dbType, ParameterDirection direction)
        {
            NpgsqlParameter p = (NpgsqlParameter)AddParameter(name, dbType);
            p.Direction = direction;
            return p;
        }

        public IDbDataParameter AddParameter(string name, object value, ParameterDirection direction)
        {
            NpgsqlParameter p = (NpgsqlParameter)AddParameter(name, value);
            p.Direction = direction;
            return p;
        }

        public IDbDataParameter AddParameter(string name, DbType dbType, object value, ParameterDirection direction)
        {
            NpgsqlParameter p = (NpgsqlParameter)AddParameter(name, value, direction);
            p.DbType = dbType;
            return p;
        }

        public void ClearParameters() => _dbParameters.Clear();

        /// <summary>
        /// Открыть соединение
        /// </summary>
        public void Open()
        {
            _wasClosed = (DbConnection.State == ConnectionState.Closed);
            if (_wasClosed)
            {   
                DbConnection.ConnectionString = ConnectionString;
                DbConnection.Open();

                if (Notification != null)
                    _dbConnection.Notification += new NotificationEventHandler(Notification);
            }
        }

        public void Open(string connectionString)
        {
            ConnectionString = connectionString;
            Open();
        }

        /// <summary>
        /// Открыть асинхронное соединение
        /// </summary>
        public Task OpenAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            if (DbConnection.State != ConnectionState.Open)
            {
                DbConnection.ConnectionString = ConnectionString;
                return ((DbConnection)DbConnection).OpenAsync(cancellationToken);
            }
            return Task.FromResult(0);
        }        

        public void OpenWithNewPassword(string newPassword)
        {
            throw new NotImplementedException();
        }

        public void BeginTransaction()
        {
            Transaction = _dbConnection.BeginTransaction();
        }

        public void CommitTransaction()
        {
            Transaction.Commit();
        }

        public IDataReader ExecuteReader(CommandType commandType, string commandText)
        {
            Open();

            DbCommand = new NpgsqlCommand();
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);

            DataReader = DbCommand.ExecuteReader();
            DbCommand.Parameters.Clear();

            return DataReader;
        }

        public object ExecuteScalar(CommandType commandType, string commandText)
        {
            Open();

            DbCommand = new NpgsqlCommand();
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);
            
            object returnValue = DbCommand.ExecuteScalar();

            DbCommand.Parameters.Clear();

            if (_wasClosed)
                DbConnection.Close();

            return returnValue;
        }

        public async Task<object> ExecuteScalarAsync(CommandType commandType, string commandText)
        {
            Open();

            DbCommand = new NpgsqlCommand();
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);
           
            object returnValue = await ((NpgsqlCommand) DbCommand).ExecuteScalarAsync();

            DbCommand.Parameters.Clear();

            if (_wasClosed)
                DbConnection.Close();
            
            return returnValue;
        }

        public int ExecuteNonQuery(CommandType commandType, string commandText)
        {
            Open();

            DbCommand = new NpgsqlCommand();
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);

            int returnValue = DbCommand.ExecuteNonQuery();
            DbCommand.Parameters.Clear();

            if (_wasClosed)
                DbConnection.Close();

            return returnValue;
        }

        public async Task<int> ExecuteNonQueryAsync(CommandType commandType, string commandText)
        {
            await OpenAsync();

            DbCommand = new NpgsqlCommand();
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);

            int returnValue = await ((NpgsqlCommand)DbCommand).ExecuteNonQueryAsync();
            DbCommand.Parameters.Clear();

            if (_wasClosed)
                DbConnection.Close();

            return await Task.FromResult(returnValue);            
        }

        private void PrepareCommand(IDbCommand command, IDbConnection connection, IDbTransaction transaction, CommandType commandType, string commandText)
        {
            command.Connection = connection;
            command.CommandText = commandText;
            command.CommandType = commandType;

            foreach (NpgsqlParameter p in _dbParameters)
            {
                command.Parameters.Add(p);
            }

            if (transaction != null)
                command.Transaction = transaction;
        }

        public void CloseReader()
        {
            DataReader?.Close();
        }

        /// <summary>
        /// Закрыть соединение
        /// </summary>
        public void Close()
        {
            if (DbConnection.State != ConnectionState.Closed)
                DbConnection.Close();
        }
    }  
}
