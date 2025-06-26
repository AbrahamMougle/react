import { useState, useEffect } from "react";

type Task = {
  text: string;
  done: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Charger depuis le localStorage au démarrage
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "todo">("all");

  const handleAddTask = () => {
    const trimmed = input.trim();
    if (trimmed === "") return;

    if (tasks.some((task) => task.text.toLowerCase() === trimmed.toLowerCase())) {
      window.alert("Cette tâche existe déjà !");
      return;
    }

    setTasks([...tasks, { text: trimmed, done: false }]);
    setInput("");
  };

  const handleDeleteTask = (index: number) => {
    setTasks(tasks.filter((_, idx) => idx !== index));
    if (editIdx === index) {
      setEditIdx(null);
      setEditValue("");
    }
  };

  const toggleTaskDone = (index: number) => {
    setTasks(tasks.map((task, idx) =>
      idx === index ? { ...task, done: !task.done } : task
    ));
  };

  const handleEditTask = (index: number) => {
    setEditIdx(index);
    setEditValue(tasks[index].text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditValidate = (index: number) => {
    const trimmed = editValue.trim();
    if (trimmed === "") return;
    if (
      tasks.some(
        (task, idx) =>
          idx !== index && task.text.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      window.alert("Cette tâche existe déjà !");
      return;
    }
    setTasks(
      tasks.map((task, idx) =>
        idx === index ? { ...task, text: trimmed } : task
      )
    );
    setEditIdx(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditValue("");
  };

  // Sauvegarder dans le localStorage à chaque modification de tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Filtrage des tâches selon le filtre sélectionné
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "done") return task.done;
    if (filter === "todo") return !task.done;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Ma TodoListe
        </h1>
        {/* Filtres */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-green-500 text-white" : "bg-green-100 text-green-700"}`}
            onClick={() => setFilter("all")}
          >
            Toutes
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "todo" ? "bg-green-500 text-white" : "bg-green-100 text-green-700"}`}
            onClick={() => setFilter("todo")}
          >
            À faire
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "done" ? "bg-green-500 text-white" : "bg-green-100 text-green-700"}`}
            onClick={() => setFilter("done")}
          >
            Terminées
          </button>
        </div>
        {/* Compteur de tâches */}
        <div className="flex justify-center gap-4 mb-4 text-green-700 font-semibold">
          <span>Total : {tasks.length}</span>
          <span>À faire : {tasks.filter(t => !t.done).length}</span>
            <span>Terminées : {tasks.filter(t => t.done).length}</span>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleAddTask();
            }}
            placeholder="Ajouter une tâche"
            className="flex-1 px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {filteredTasks.map((task, idx) => {
            // Pour garder les bons index lors de l'édition/suppression, il faut retrouver l'index réel dans tasks
            const realIdx = tasks.findIndex(t => t === task);
            return (
              <li
                key={realIdx}
                className="bg-green-50 border border-green-200 rounded px-3 py-2 text-green-800 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTaskDone(idx)}
                    className="accent-green-500"
                  />
                  {editIdx === idx ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => handleEditValidate(idx)}
                        className="text-green-600 font-bold ml-1"
                        title="Valider"
                      >
                        ✔
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-400 font-bold ml-1"
                        title="Annuler"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <span className={task.done ? "line-through opacity-60" : ""}>
                      {task.text}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editIdx !== idx && (
                    <button
                      onClick={() => handleEditTask(idx)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Modifier"
                    >
                      ✎
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(idx)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer"
                  >
                    🗑
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}