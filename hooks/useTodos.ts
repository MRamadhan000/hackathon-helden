"use client";

import { useEffect, useState } from "react";
import { getTodos } from "@/services/todo.service";
import { Todo } from "@/types/todo";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTodos() {
    try {
      setLoading(true);
      setError(null);

      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    refetch: fetchTodos,
  };
}
