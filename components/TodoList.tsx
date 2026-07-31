"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useConnection } from "@/hooks/useConnection";
import { addTodo } from "@/services/todo.service";

export default function TodoList() {
  const { todos, loading, error, refetch } = useTodos();

  const {
    connected,
    checking,
    lastChecked,
  } = useConnection();

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) return;

    try {
      setSubmitting(true);

      await addTodo(name);

      setName("");

      await refetch();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan todo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              checking
                ? "bg-yellow-500 animate-pulse"
                : connected
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <div>
            <p className="font-semibold">
              {checking
                ? "Checking connection..."
                : connected
                ? "Connected to Supabase"
                : "Disconnected"}
            </p>

            {lastChecked && (
              <p className="text-sm text-gray-500">
                Last checked:{" "}
                {lastChecked.toLocaleTimeString("id-ID")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Masukkan todo..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting || !connected}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Menyimpan..." : "Tambah"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="rounded border p-4 text-center text-gray-500">
            Belum ada todo.
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="rounded-lg border p-4 shadow-sm"
            >
              <h3 className="font-semibold">
                {todo.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {new Date(todo.created_at).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}