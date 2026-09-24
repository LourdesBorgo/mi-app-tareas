const API_URL = '/api/tareas';

const form = document.getElementById('form-tarea');
const input = document.getElementById('input-tarea');
const lista = document.getElementById('lista-tareas');
const contador = document.getElementById('contador');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', cargarTareas);

// Evento: agregar tarea
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;

    await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto })
    });

    input.value = '';
    cargarTareas();
});

// Función: obtener y mostrar tareas
async function cargarTareas() {
    const res = await fetch(API_URL);
    const tareas = await res.json();
    renderizarTareas(tareas);
}

// Función: renderizar en el DOM
function renderizarTareas(tareas) {
    lista.innerHTML = '';

    tareas.forEach(tarea => {
    const li = document.createElement('li');
    if (tarea.completada) li.classList.add('completada');

    const span = document.createElement('span');
    span.textContent = tarea.texto;
    span.addEventListener('click', () => toggleTarea(tarea.id));

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    li.appendChild(span);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
    });

    const pendientes = tareas.filter(t => !t.completada).length;
    contador.textContent = `${pendientes} tarea(s) pendiente(s) de ${tareas.length}`;
}

// Función: marcar/desmarcar completada
async function toggleTarea(id) {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    cargarTareas();
}

// Función: eliminar tarea
async function eliminarTarea(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarTareas();
}