using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Kit.Dal.DbManager;
using Oracle.DataAccess.Client;

namespace Kit.Dal.Oracle
{
    [ProviderName("Oracle.DataAccess.Client")]
    public class OracleDbManager : IDbManager
    {
        private bool _wasClosed;

        /// <summary>
        /// DbConnection
        /// </summary>
        private OracleConnection _dbConnection;

        public IDbConnection DbConnection => _dbConnection = _dbConnection ?? new OracleConnection();

        /// <summary>
        /// DbTransaction
        /// </summary>
        private OracleTransaction _transaction;

        public IDbTransaction Transaction => _transaction;

        public string ConnectionString { get; set; }
        
        public IDataReader DataReader { get; private set; }

        public IDbCommand DbCommand { get; private set; }

        private readonly IList<OracleParameter> _dbParameters = new List<OracleParameter>();

        // ReSharper disable once CoVariantArrayConversion
        public IDbDataParameter[] DbParameters => _dbParameters.ToArray();

        public Action<string> Log { get; set; }

        public Action<object, EventArgs> Notification { get; set; }

        public void AddParameter(IDbDataParameter dataParameter)
        {
            _dbParameters.Add((OracleParameter) dataParameter);
        }

        public IDbDataParameter AddParameter(string name, object value)
        {
            OracleParameter p = new OracleParameter()
            {
                ParameterName = name,
                Value = value
            };

            _dbParameters.Add(p);
            return p;
        }

        public IDbDataParameter AddParameter(string name, object value, ParameterDirection direction)
        {
            OracleParameter p = (OracleParameter) AddParameter(name, value);
            p.Direction = direction;
            return p;
        }

        public IDbDataParameter AddParameter(string name, object value, ParameterDirection direction, int size)
        {
            OracleParameter p = (OracleParameter)AddParameter(name, value, direction);
            p.Size = size;
            return p;
        }

        public void BeginTransaction()
        {
            _transaction = DbConnection.BeginTransaction() as OracleTransaction;
        }

        public void CommitTransaction()
        {
            _transaction?.Commit();
            _transaction = null;
        }

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
                    _dbConnection.InfoMessage += new OracleInfoMessageEventHandler(Notification);
            }
        }

        public void Open(string connectionString)
        {
            ConnectionString = connectionString;
            Open();
        }

        public void OpenWithNewPassword(string newPassword)
        {
            _wasClosed = (DbConnection.State == ConnectionState.Closed);
            if (_wasClosed)
            {
                DbConnection.ConnectionString = ConnectionString;
                _dbConnection.OpenWithNewPassword(newPassword);
            }
        }

        public IDataReader ExecuteReader(CommandType commandType, string commandText)
        {
            DbCommand = new OracleCommand() { BindByName = true };
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);
            
            DataReader = DbCommand.ExecuteReader();
            DbCommand.Parameters.Clear();

            return DataReader;
        }

        public DataSet ExecuteDataSet(CommandType commandType, string commandText)
        {
            DbCommand = new OracleCommand(commandText) { BindByName = true };
            
            IDbDataAdapter dataAdapter = new OracleDataAdapter();
            dataAdapter.SelectCommand = DbCommand;

            DataSet dataSet = new DataSet();
            dataAdapter.Fill(dataSet);
            DbCommand.Parameters.Clear();

            return dataSet;
        }

        public object ExecuteScalar(CommandType commandType, string commandText)
        {
            Open();

            DbCommand = new OracleCommand() { BindByName = true };
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);

            object returnValue = DbCommand.ExecuteScalar();
            DbCommand.Parameters.Clear();

            if (_wasClosed)
                DbConnection.Close();

            return returnValue;
        }

        public int ExecuteNonQuery(CommandType commandType, string commandText)
        {
            Open();

            DbCommand = new OracleCommand() { BindByName = true };
            PrepareCommand(DbCommand, DbConnection, Transaction, commandType, commandText);
            
            int returnValue = DbCommand.ExecuteNonQuery();
            DbCommand.Parameters.Clear();

            if (_wasClosed)
                DbConnection.Close();

            return returnValue;
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

        private void PrepareCommand(IDbCommand command, IDbConnection connection, IDbTransaction transaction, CommandType commandType, string commandText)
        {
            command.Connection = connection;
            command.CommandText = commandText;
            command.CommandType = commandType;
            
            foreach (OracleParameter p in _dbParameters)
            {
                command.Parameters.Add(p);
            }

            if (transaction != null)
                command.Transaction = transaction;
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            Close();

            DbCommand = null;
            DataReader = null;

            _transaction = null;
            _dbConnection = null;
        }
        
    }
}
