# sap-plytix

##### Sincronizacion entre ERP (SAP) y PIM (Plytix)

Proceso de Sincronización entre SAP y Plytix
• Este script automatizado tiene como objetivo sincronizar la información de productos entre los sistemas SAP y Plytix. A continuación, se describe paso a paso el proceso completo:  
  
Obtención de Datos de SAP:
• Se utilizan solicitudes HTTP GET para obtener la información de productos desde SAP.  
• Se accede a múltiples URL proporcionadas, lo que permite obtener una amplia gama de datos de productos.  
  
Obtención de Datos de Plytix:
• Se utiliza un token de autenticación para acceder a la API de Plytix y obtener los productos existentes en la plataforma.  
• La función getAllProducts se encarga de recuperar todos los productos de Plytix asociados al token proporcionado.  
  
Filtrado de Datos:  
• Se aplican varios filtros a los datos obtenidos de SAP y Plytix para garantizar que solo se sincronicen los productos relevantes y válidos.  
• En el caso de SAP (FV), se filtra por estado del material (StGralMaterial) y categoría, excluyendo ciertas categorías específicas como "DA" y "OT".  
• Para Ferrum, se aplican filtros similares pero también se tienen en cuenta otros criterios como el estado OV (StOvMaterial), la marca de baja (Marcabaja) y la calidad (Calidad).  

Comparación de SKU:  
• Se lleva a cabo una comparación entre los productos obtenidos de SAP y los existentes en Plytix para identificar diferencias.  
• Esta comparación se realiza mediante la función comparasion, que detecta productos nuevos que deben agregarse a Plytix.  
  
Creación de Nuevos Productos en Plytix:  
• Los productos nuevos identificados en SAP se crean en Plytix utilizando solicitudes POST a la API de Plytix.  
• Se utiliza un token de autenticación específico para estas operaciones de creación de productos.  
  
Monitoreo de Uso de Recursos:  
• Se verifica el uso de CPU y memoria del sistema después de la sincronización.  
• Se utiliza la función checkMemory para evaluar el uso de memoria y se calcula el uso de CPU en base al inicio y fin de la ejecución del script.  
  
Generación de Logs:  
• Se registran eventos y posibles errores durante el proceso de sincronización en un archivo de registro (logs).  
• Esto permite mantener un historial de las actividades realizadas y facilita la resolución de problemas en caso de errores.  
