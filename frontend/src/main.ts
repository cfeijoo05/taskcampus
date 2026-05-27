import './style.css'

const API_URL = 'http://localhost:5000/tasks';

// Interfaces basadas en la especificación SDD
interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  asignatura: string;
  fecha_entrega: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en proceso' | 'finalizada';
}

async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks: Task[] = await response.json();
  renderTasks(tasks);
}

async function fetchSummary() {
  const response = await fetch(`${API_URL}/summary`);
  const summary = await response.json();
  document.querySelector<HTMLDivElement>('#summary')!.innerHTML = `
    <div class="flex gap-4 mb-4 text-sm font-bold">
      <span class="bg-blue-200 p-2 rounded">Total: ${summary.total_tareas}</span>
      <span class="bg-yellow-200 p-2 rounded">Pendientes: ${summary.tareas_pendientes}</span>
      <span class="bg-green-200 p-2 rounded">Finalizadas: ${summary.tareas_finalizadas}</span>
      <span class="bg-red-200 p-2 rounded">Prioridad Alta: ${summary.tareas_alta_prioridad}</span>
    </div>
  `;
}

function renderTasks(tasks: Task[]) {
  const container = document.querySelector<HTMLDivElement>('#task-list')!;
  container.innerHTML = tasks.map(task => `
    <div class="border p-4 mb-2 rounded shadow bg-white">
      <h3 class="text-lg font-bold">${task.titulo} - <span class="text-gray-500 text-sm">${task.asignatura}</span></h3>
      <p class="text-gray-700">${task.descripcion}</p>
      <div class="mt-2 flex gap-2 text-xs">
        <span class="bg-gray-100 px-2 py-1 rounded">Vence: ${task.fecha_entrega}</span>
        <span class="bg-gray-100 px-2 py-1 rounded">Prioridad: ${task.prioridad}</span>
        <span class="bg-gray-100 px-2 py-1 rounded">Estado: ${task.estado}</span>
      </div>
    </div>
  `).join('');
}

// Inicialización
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-blue-800">TaskCampus - UTMACH</h1>
    <div id="summary"></div>
    <h2 class="text-xl font-bold mb-4">Mis Tareas</h2>
    <div id="task-list"></div>
  </div>
`;

fetchSummary();
fetchTasks();