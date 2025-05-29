
import { useState } from 'react';
import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';
import { EditTaskModal } from '../components/EditTaskModal';
import { Task, ParsedTask } from '../types/Task';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = (parsedTask: ParsedTask) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...parsedTask,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const editTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Natural Language Task Manager
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your thoughts into organized tasks using natural language. 
            Just describe what needs to be done and let AI handle the parsing.
          </p>
        </div>

        {/* Task Input */}
        <TaskInput onAddTask={addTask} />

        {/* Task List */}
        <TaskList 
          tasks={tasks}
          onEditTask={setEditingTask}
          onDeleteTask={deleteTask}
        />

        {/* Edit Modal */}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
            onSave={editTask}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
