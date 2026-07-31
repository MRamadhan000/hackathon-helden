import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getTodos } from '@/services/todoService' // <-- Panggil dari services

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Memanggil service
  const todos = await getTodos(supabase)

  return (
    <ul>
      {todos?.map((todo: any) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  )
}