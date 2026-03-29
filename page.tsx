import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase
    .from('todos')
    .select('id, task')

  if (error) {
    return <p>Failed to load todos.</p>
  }

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
      ))}
    </ul>
  )
}