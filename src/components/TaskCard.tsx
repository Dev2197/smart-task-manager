
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Calendar, User, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'P2':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P3':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'P4':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDueDate = (date: Date | null) => {
    if (!date) return null;
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    
    if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    }
    
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {task.name}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{task.assignedTo}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                <Clock className="w-4 h-4" />
                <span>{formatDueDate(task.dueDate)}</span>
                {isOverdue && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full ml-1">
                    Overdue
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-600 h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-600 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Created {format(task.createdAt, 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            task.priority === 'P1' ? 'bg-red-400' :
            task.priority === 'P2' ? 'bg-orange-400' :
            task.priority === 'P3' ? 'bg-blue-400' : 'bg-gray-400'
          }`} />
        </div>
      </div>
    </div>
  );
};
