import { CheckSquare, Plus } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <CheckSquare className="w-12 h-12 text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>

      <p className="text-gray-500 text-center max-w-md mb-6">
        Start by adding tasks using natural language. Try something
        like
        <span className="font-medium text-gray-700">
          {" "}
          "Review design docs by Devendra tomorrow at 2pm P1"
        </span>
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
          "Submit report to Devendra by Friday 10am P1"
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
          "Call client Rajeev tomorrow 5pm"
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
          "Finish landing page Aman by 11pm 20th June"
        </span>
      </div>
    </div>
  );
};
