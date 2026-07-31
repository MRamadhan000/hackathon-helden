import { SupabaseClient } from '@supabase/supabase-js'

export async function getTodos(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('todos').select('*')
  
  if (error) {
    console.error('Error fetching todos:', error.message)
    throw new Error(error.message)
  }
  
  return data
}

export async function addTodo(supabase: SupabaseClient, name: string) {
  const { data, error } = await supabase
    .from('todos')
    .insert([{ name }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}