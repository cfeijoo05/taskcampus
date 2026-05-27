# TaskCampus

## Descripción del Proyecto
TaskCampus es una aplicación web diseñada bajo la metodología Spec Driven Development (SDD) para que los estudiantes universitarios registren, gestionen y controlen sus actividades académicas.

## Instalación del Backend (Python)
1. Navega a la carpeta `backend/`.
2. Instala las dependencias: `pip install flask flask-cors`
3. Ejecuta el servidor: `python app.py`
4. El servidor correrá en `http://localhost:5000` utilizando un archivo `tasks.json` como persistencia.

## Instalación del Frontend (TypeScript)
1. Navega a la carpeta `frontend/`.
2. Instala los paquetes: `npm install`
3. Inicia el entorno de desarrollo: `npm run dev`

## Endpoints Disponibles
| Método | Ruta             | Descripción        |
|--------|------------------|--------------------|
| GET    | `/tasks`         | Listar tareas      |
| GET    | `/tasks/{id}`    | Consultar tarea    |
| POST   | `/tasks`         | Crear tarea        |
| PUT    | `/tasks/{id}`    | Actualizar tarea   |
| DELETE | `/tasks/{id}`    | Eliminar tarea     |
| GET    | `/tasks/summary` | Mostrar resumen    |

## Integrantes del Grupo
- Carlos Fernando Feijoo Zhangallimbay