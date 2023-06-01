import { TodoItem } from "@/components/TodoItem"
import { prisma } from "@/db"
import Link from "next/link"
import { useRouter } from "next/router";

export const revalidate = 500; // revalidate every hour

function getTodos() {
  return prisma.todo.findMany()
}

async function toggleTodo(id: string, complete: boolean) {
  "use server"

  return await prisma.todo.update({ where: { id }, data: { complete } })
}

async function removeTodo(id: string) {
  "use server"

  return await prisma.todo.delete({ where: { id } })
}

export default async function Home() {
  const todos = await getTodos()

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new"
        >
          New
        </Link>
      </header>
      <ul className="pl-4">
        {todos.map(todo => (
          <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} removeTodo={removeTodo} />
        ))}
      </ul>
    </>
  )
}
