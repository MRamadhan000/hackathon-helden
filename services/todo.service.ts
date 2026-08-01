import { createClient } from "@/utils/supabase/client";
import { Todo } from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;

  return data;
}

export async function getFirstTodo(): Promise<Todo | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function addTodo(name: string): Promise<Todo> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("todos")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteTodo(id: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}