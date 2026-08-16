import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { completeTask, reopenTask, deleteTask } from "@/actions/tasks";
import { EditableTitle } from "@/components/tasks/editable-title";
import type { TaskListItem } from "@/lib/tasks/queries";

export function TaskRow({ task }: { task: TaskListItem }) {
  const isDone = task.status === "done";
  const toggleAction = isDone ? reopenTask : completeTask;

  return (
    <li className="flex items-center gap-3 border-b py-2">
      <form action={toggleAction.bind(null, task.id)}>
        <button
          type="submit"
          aria-label={isDone ? "פתח מחדש" : "סמן כהושלם"}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDone ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </button>
      </form>

      <EditableTitle taskId={task.id} title={task.title} />

      <form action={deleteTask.bind(null, task.id)}>
        <button
          type="submit"
          aria-label="מחק משימה"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </form>
    </li>
  );
}
