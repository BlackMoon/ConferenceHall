using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

#if NETCOREAPP1_1
using Microsoft.Extensions.DependencyModel;
using System.Runtime.Loader;
#endif

namespace Kit.Dal.DbManager
{
    /// <summary>
    /// Фабрика типов DbManager
    /// </summary>
    public static class DbManagerFactory
    {
        /// <summary>
        /// Словарь соответвий [наименование провайдера - тип DbManager'a] 
        /// </summary>
        private static readonly IDictionary<string, Type> Managers;

        static DbManagerFactory()
        {
            // Register assemblies
            string contentRootPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

            string[] assemblies = (contentRootPath != null) ?
                Directory
                    .GetFiles(contentRootPath, "Kit.Dal.*.dll", SearchOption.TopDirectoryOnly)
                    .Select(Path.GetFileNameWithoutExtension)
                    .ToArray() : new string[]{};

            Func<Type, bool> pre = t => t.GetInterfaces().Contains(typeof(IDbManager));
            Managers = new Dictionary<string, Type>(assemblies.Length);

            foreach (string a in assemblies)
            {
                string assemblyFile = $"{contentRootPath}\\{a}.dll";

#if NETCOREAPP1_1
                RuntimeLibrary lib = DependencyContext
                    .Default
                    .RuntimeLibraries
                    .FirstOrDefault(l => string.Equals(l.Name, a, StringComparison.OrdinalIgnoreCase));

                var assembly = lib != null ?
                    AssemblyLoadContext.Default.LoadFromAssemblyName(new AssemblyName(lib.Name)) :
                    AssemblyLoadContext.Default.LoadFromAssemblyPath(a);
#endif
#if NET46
                Assembly assembly = Assembly.LoadFrom(a);
#endif
                foreach (Type t in assembly.GetTypes().Where(pre))
                {
                    // Наименование --> из аттрибута
#if NETCOREAPP1_1
                    var attr = (ProviderNameAttribute)t.GetTypeInfo().GetCustomAttribute(typeof(ProviderNameAttribute));
#endif
#if NET46
                    var attr = (ProviderNameAttribute)t.GetCustomAttribute(typeof(ProviderNameAttribute));
#endif
                    if (attr != null)
                        Managers[attr.ProviderName] = t;
                }
            }
        }

        public static IDbManager CreateDbManager(string providerName, string connectionString = null)
        {
            IDbManager dbManager;

            Type t = null;
            Managers?.TryGetValue(providerName, out t);

            if (t != null)
            {
                dbManager = (IDbManager) Activator.CreateInstance(t);
                dbManager.ConnectionString = connectionString;
            }
            else
                throw new TypeLoadException($"Provider {providerName} not found.");

            return dbManager;
        }
    }
}
