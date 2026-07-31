import TodoList from "@/components/TodoList";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Todo List
      </h1>

      <TodoList />
    </main>
  );
}