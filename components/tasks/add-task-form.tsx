"use client";

import { useRef, useState, useTransition } from "react";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData: FormData) => {
        startTransition(async () => {
          const result = await createTask(formData);
          if (result.error) {
            setError(result.error);
            return;
          }
          setError(null);
          formRef.current?.reset();
        });
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <Input
          name="title"
          placeholder="משימה חדשה…"
          required
          autoFocus
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          הוסף
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
