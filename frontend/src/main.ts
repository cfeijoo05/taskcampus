import './style.css'

const API_URL = 'http://localhost:5000/tasks';

interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  asignatura: string;
  fecha_entrega: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en proceso' | 'finalizada';
}

// Variables de estado
let tasks: Task[] = [];
let editingId: string | null = null;

// ================= FUNCIONES DE API =================
async function fetchTasks(filtros = '') {
  const response = await fetch(`${API_URL}${filtros}`);
  tasks = await response.json();
  renderTasks();
}

async function fetchSummary() {
  const response = await fetch(`${API_URL}/summary`);
  const summary = await response.json();
  document.querySelector<HTMLDivElement>('#summary')!.innerHTML = `
    <div class="grid grid-cols-4 gap-4 mb-6 text-sm font-bold text-center">
      <div class="bg-blue-100 p-3 rounded shadow">Total<br><span class="text-xl">${summary.total_tareas}</span></div>
      <div class="bg-yellow-100 p-3 rounded shadow">Pendientes<br><span class="text-xl">${summary.tareas_pendientes}</span></div>
      <div class="bg-green-100 p-3 rounded shadow">Finalizadas<br><span class="text-xl">${summary.tareas_finalizadas}</span></div>
      <div class="bg-red-100 p-3 rounded shadow">Prioridad Alta<br><span class="text-xl">${summary.tareas_alta_prioridad}</span></div>
    </div>
  `;
}

async function saveTask(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const taskData = Object.fromEntries(formData.entries());

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `${API_URL}/${editingId}` : API_URL;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });

  editingId = null;
  form.reset();
  (document.getElementById('btn-submit') as HTMLButtonElement).innerText = 'Registrar Tarea';
  refreshAll();
}

async function deleteTask(id: string) {
  if (confirm('¿Eliminar esta tarea?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    refreshAll();
  }
}

function editTask(id: string) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  editingId = task.id;
  (document.getElementById('titulo') as HTMLInputElement).value = task.titulo;
  (document.getElementById('descripcion') as HTMLInputElement).value = task.descripcion;
  (document.getElementById('asignatura') as HTMLInputElement).value = task.asignatura;
  (document.getElementById('fecha_entrega') as HTMLInputElement).value = task.fecha_entrega;
  (document.getElementById('prioridad') as HTMLSelectElement).value = task.prioridad;
  (document.getElementById('estado') as HTMLSelectElement).value = task.estado;
  
  (document.getElementById('btn-submit') as HTMLButtonElement).innerText = 'Actualizar Tarea';
}

function applyFilters() {
  const estado = (document.getElementById('f-estado') as HTMLSelectElement).value;
  const prioridad = (document.getElementById('f-prioridad') as HTMLSelectElement).value;
  const asignatura = (document.getElementById('f-asignatura') as HTMLInputElement).value;
  
  const params = new URLSearchParams();
  if (estado) params.append('estado', estado);
  if (prioridad) params.append('prioridad', prioridad);
  if (asignatura) params.append('asignatura', asignatura);
  
  fetchTasks(`?${params.toString()}`);
}

function refreshAll() {
  fetchSummary();
  fetchTasks();
}

// ================= RENDERIZADO VISUAL =================
function renderTasks() {
  const container = document.querySelector<HTMLDivElement>('#task-list')!;
  container.innerHTML = tasks.map(task => `
    <div class="border p-4 mb-3 rounded shadow-sm bg-white flex justify-between items-start">
      <div>
        <h3 class="text-lg font-bold">${task.titulo} <span class="text-gray-500 font-normal text-sm">(${task.asignatura})</span></h3>
        <p class="text-gray-700 my-1">${task.descripcion}</p>
        <div class="mt-2 flex gap-2 text-xs font-semibold">
          <span class="bg-gray-100 px-2 py-1 rounded">📅 ${task.fecha_entrega}</span>
          <span class="${task.prioridad === 'alta' ? 'bg-red-100 text-red-800' : 'bg-gray-100'} px-2 py-1 rounded">⚠️ ${task.prioridad.toUpperCase()}</span>
          <span class="${task.estado === 'finalizada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-2 py-1 rounded">📌 ${task.estado.toUpperCase()}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editTask('${task.id}')" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Editar</button>
        <button onclick="deleteTask('${task.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Eliminar</button>
      </div>
    </div>
  `).join('');
}

// ================= ESTRUCTURA HTML PRINCIPAL =================
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
    <h1 class="text-3xl font-bold mb-6 text-blue-900 text-center">TaskCampus</h1>
    
    <div id="summary"></div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="md:col-span-1 bg-white p-5 rounded shadow">
        <h2 class="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Registrar/Editar</h2>
        <form id="task-form" class="flex flex-col gap-3">
          <input id="titulo" name="titulo" type="text" placeholder="Título" required class="border p-2 rounded text-sm">
          <input id="descripcion" name="descripcion" type="text" placeholder="Descripción" required class="border p-2 rounded text-sm">
          <input id="asignatura" name="asignatura" type="text" placeholder="Asignatura" required class="border p-2 rounded text-sm">
          <input id="fecha_entrega" name="fecha_entrega" type="date" required class="border p-2 rounded text-sm">
          
          <select id="prioridad" name="prioridad" class="border p-2 rounded text-sm">
            <option value="baja">Prioridad: Baja</option>
            <option value="media">Prioridad: Media</option>
            <option value="alta">Prioridad: Alta</option>
          </select>
          
          <select id="estado" name="estado" class="border p-2 rounded text-sm">
            <option value="pendiente">Estado: Pendiente</option>
            <option value="en proceso">Estado: En Proceso</option>
            <option value="finalizada">Estado: Finalizada</option>
          </select>
          
          <button id="btn-submit" type="submit" class="bg-green-600 text-white p-2 rounded mt-2 hover:bg-green-700 font-bold transition">Registrar Tarea</button>
        </form>
      </div>

      <div class="md:col-span-2">
        <div class="bg-white p-4 rounded shadow mb-4 flex gap-2 items-center text-sm">
          <span class="font-bold text-gray-700">Filtrar:</span>
          <select id="f-estado" onchange="applyFilters()" class="border p-1 rounded">
            <option value="">Cualquier estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="en proceso">En proceso</option>
            <option value="finalizada">Finalizada</option>
          </select>
          <select id="f-prioridad" onchange="applyFilters()" class="border p-1 rounded">
            <option value="">Cualquier prioridad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
          <input id="f-asignatura" type="text" placeholder="Asignatura..." oninput="applyFilters()" class="border p-1 rounded w-32">
        </div>
        
        <div id="task-list" class="flex flex-col"></div>
      </div>
    </div>
  </div>
`;

// Asignar eventos globales para que funcionen los botones en el HTML inyectado
(window as any).deleteTask = deleteTask;
(window as any).editTask = editTask;
(window as any).applyFilters = applyFilters;
document.getElementById('task-form')!.addEventListener('submit', saveTask);

// Inicializar la app
refreshAll();