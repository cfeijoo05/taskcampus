# Especificación del sistema TaskCampus
## Problema
Los estudiantes necesitan organizar sus tareas académicas.
## Objetivo
Desarrollar una aplicación web para registrar, consultar, actualizar y eliminar tareas.
## Usuarios
Estudiantes universitarios.

## Historias de usuario
- Como estudiante, quiero registrar tareas para organizar mis actividades.
- Como estudiante, quiero filtrar tareas por estado para identificar mis pendientes.
- Como estudiante, quiero marcar tareas como finalizadas para controlar mi avance.

## Requisitos funcionales
RF01. Registrar tareas.
RF02. Listar tareas.
RF03. Editar tareas.
RF04. Eliminar tareas.
RF05. Filtrar tareas.
RF06. Mostrar resumen estadístico.

## Requisitos no funcionales
RNF01. La interfaz debe ser clara y sencilla.
RNF02. El backend debe exponer una API REST.
RNF03. El código debe estar versionado en GitHub.
RNF04. El proyecto debe incluir documentación de instalación.

## Arquitectura del Sistema
A continuación, el diagrama de flujo de datos (DFD) del sistema:

```mermaid
graph TD;
    A[Frontend React/TS] -->|HTTP POST, GET, PUT, DELETE| B(Backend Flask);
    B -->|Lee/Escribe JSON| C[(tasks.json)];
    C --> B;
    B -->|Retorna JSON| A;