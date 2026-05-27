from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid

app = Flask(__name__)
CORS(app) # Permite que el frontend se comunique con el backend

DB_FILE = 'tasks.json'

def load_tasks():
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def save_tasks(tasks):
    with open(DB_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

# POST /tasks - Crear tarea
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    tasks = load_tasks()
    
    new_task = {
        "id": str(uuid.uuid4()),
        "titulo": data.get("titulo"),
        "descripcion": data.get("descripcion"),
        "asignatura": data.get("asignatura"),
        "fecha_entrega": data.get("fecha_entrega"),
        "prioridad": data.get("prioridad"), # baja, media, alta
        "estado": data.get("estado") # pendiente, en proceso, finalizada
    }
    
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201

# GET /tasks - Listar y Filtrar tareas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = load_tasks()
    estado = request.args.get('estado')
    prioridad = request.args.get('prioridad')
    asignatura = request.args.get('asignatura')

    if estado: tasks = [t for t in tasks if t['estado'] == estado]
    if prioridad: tasks = [t for t in tasks if t['prioridad'] == prioridad]
    if asignatura: tasks = [t for t in tasks if t['asignatura'] == asignatura]

    return jsonify(tasks), 200

# GET /tasks/summary - Mostrar resumen
@app.route('/tasks/summary', methods=['GET'])
def get_summary():
    tasks = load_tasks()
    resumen = {
        "total_tareas": len(tasks),
        "tareas_pendientes": sum(1 for t in tasks if t['estado'] == 'pendiente'),
        "tareas_finalizadas": sum(1 for t in tasks if t['estado'] == 'finalizada'),
        "tareas_alta_prioridad": sum(1 for t in tasks if t['prioridad'] == 'alta')
    }
    return jsonify(resumen), 200

# GET /tasks/{id} - Consultar tarea
@app.route('/tasks/<id>', methods=['GET'])
def get_task(id):
    tasks = load_tasks()
    task = next((t for t in tasks if t['id'] == id), None)
    return jsonify(task) if task else (jsonify({"error": "No encontrada"}), 404)

# PUT /tasks/{id} - Actualizar tarea
@app.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    data = request.json
    tasks = load_tasks()
    for t in tasks:
        if t['id'] == id:
            t.update({k: v for k, v in data.items() if v is not None})
            save_tasks(tasks)
            return jsonify(t), 200
    return jsonify({"error": "No encontrada"}), 404

# DELETE /tasks/{id} - Eliminar tarea
@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    tasks = load_tasks()
    filtered_tasks = [t for t in tasks if t['id'] != id]
    if len(tasks) == len(filtered_tasks):
        return jsonify({"error": "No encontrada"}), 404
    save_tasks(filtered_tasks)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5000)