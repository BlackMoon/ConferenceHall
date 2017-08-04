using DryIoc;
using DryIoc.Microsoft.DependencyInjection;
using Kit.Core.Interception;
using Kit.Core.Interception.Attribute;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

#if NETCOREAPP1_1
using Microsoft.Extensions.DependencyModel;
using System.Runtime.Loader;
#endif

namespace Kit.Core
{
    public class DryIocStartup
    {
        /// <summary>
        /// Регистрация сборок в DryIoc-контейнере 
        /// </summary>
        /// <param name="services">Коллекция сервисов</param>
        /// <param name="assemblies">Список сборок</param>
        /// <returns>IContainer</returns>
        protected IContainer ConfigureDependencies(IServiceCollection services, params string[] assemblies)
        {
            // Register assemblies
            string contentRootPath = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

            IList<Assembly> implTypeAssemblies = new List<Assembly>(assemblies.Count());
            
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
                    AssemblyLoadContext.Default.LoadFromAssemblyPath(assemblyFile);
#endif
#if NET46
                var assembly = Assembly.LoadFrom(assemblyFile);
#endif
                implTypeAssemblies.Add(assembly);
            }

            IContainer container = new Container().WithDependencyInjectionAdapter(services);
            container.RegisterMany(implTypeAssemblies, (registrator, types, type) =>
            {
                TypeInfo ti = type.GetTypeInfo();

                IgnoreRegistrationAttribute ignoreAttr = (IgnoreRegistrationAttribute)ti.GetCustomAttribute(typeof(IgnoreRegistrationAttribute));
                if (ignoreAttr == null)
                {
                    registrator.RegisterMany(types, type, Reuse.Transient);

                    // interceptors
                    if (ti.IsClass)
                    {
                        InterceptedObjectAttribute attr = (InterceptedObjectAttribute)ti.GetCustomAttribute(typeof(InterceptedObjectAttribute));
                        if (attr != null)
                        {
                            Type serviceType = attr.ServiceInterfaceType ?? type.GetImplementedInterfaces().FirstOrDefault();
                            registrator.Intercept(serviceType, attr.InterceptorType);
                        }
                    }
                }
            });

            return container;
        }
    }
}
