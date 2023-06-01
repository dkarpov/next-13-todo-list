"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

type TodoItemProps = {
  id: string
  title: string
  complete: boolean
  toggleTodo: (id: string, complete: boolean) => void
  removeTodo: (id: string) => void
}

export function TodoItem({ id, title, complete, toggleTodo, removeTodo }: TodoItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  // Create inline loading UI
  const isMutating = isFetching || isPending;

  async function handleDelete() {
    setIsFetching(true);
    // Mutate external data source
    await removeTodo(id);
    setIsFetching(false);

    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  }
  return (
    <li className="flex gap-1 items-center" style={{ opacity: !isMutating ? 1 : 0.7 }}>
      <input
        id={id}
        type="checkbox"
        className="cursor-pointer peer"
        defaultChecked={complete}
        onChange={e => toggleTodo(id, e.target.checked)}
      />
      <label
        htmlFor={id}
        className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500"
      >
        {title}
      </label>
      <button className="border-2 rounded p-0.5 text-xs" onClick={(evt) => handleDelete()}>Remove Todo</button>
    </li>
  )
}
