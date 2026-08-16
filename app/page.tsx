import { getActiveTasks } from "@/lib/tasks/queries";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { TaskRow } from "@/components/tasks/task-row";

export default async function Home() {
  const tasks = await getActiveTasks();

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold">ניהול משימות אישי</h1>

      <AddTaskForm />

      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground">
          אין משימות עדיין. הוסף את הראשונה למעלה.
        </p>
      ) : (
        <ul className="flex flex-col">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      )}
    </main>
  );
}
