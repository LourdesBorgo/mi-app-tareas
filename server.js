const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta del archivo JSON
const dataPath = path.join(__dirname, 'data', 'tareas.json');

// Función para leer tareas
function leerTareas() {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

// Función para guardar tareas
function guardarTareas(tareas) {
  fs.writeFileSync(dataPath, JSON.stringify(tareas, null, 2), 'utf-8');
}

// GET: Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
  res.json(leerTareas());
});

// POST: Agregar nueva tarea
app.post('/api/tareas', (req, res) => {
  const tareas = leerTareas();
  const nuevaTarea = {
    id: Date.now(),
    texto: req.body.texto,
    completada: false
  };
  tareas.push(nuevaTarea);
  guardarTareas(tareas);
  res.status(201).json(nuevaTarea);
});

// PUT: Actualizar tarea (marcar como completada)
app.put('/api/tareas/:id', (req, res) => {
  const tareas = leerTareas();
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tarea.completada = !tarea.completada;
  guardarTareas(tareas);
  res.json(tarea);
});

// DELETE: Eliminar tarea
app.delete('/api/tareas/:id', (req, res) => {
  let tareas = leerTareas();
  const id = parseInt(req.params.id);
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas(tareas);
  res.json({ mensaje: 'Tarea eliminada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});