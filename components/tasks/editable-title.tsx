"use client";

import { useState, useTransition } from "react";
import { updateTask } from "@/actions/tasks";

export function EditableTitle({
  taskId,
  title,
}: {
  taskId: string;
  title: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [isPending, startTransition] = useTransition();

  function save() {
    const trimmed = value.trim();
    setEditing(false);
    if (!trimmed || trimmed === title) {
      setValue(title);
      return;
    }
    startTransition(async () => {
      const result = await updateTask(taskId, { title: trimmed });
      if (result.error) {
        setValue(title);
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex-1 text-start"
      >
        {title}
      </button>
    );
  }

  return (
    <input
      autoFocus
      value={value}
      disabled={isPending}
      onChange={(event) => setValue(event.target.value)}
      onBlur={save}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          save();
        }
        if (event.key === "Escape") {
          setValue(title);
          setEditing(false);
        }
      }}
      className="flex-1 rounded-md border border-input bg-transparent px-2 py-1 text-sm"
    />
  );
}
