import { Router } from "https://deno.land/x/oak/mod.ts"
import { ObjectId } from "https://deno.land/x/mongo@v0.9.1/mod.ts"


import { getDb } from '../helpers/db_client.ts'
import { db } from "../../../../Library/Caches/deno/deps/https/deno.land/12ddae6a2a358f3f6e40aadbbc8c0a788c9c21c9216bec3dfbefe99c02602ff6"

const router = new Router()

interface Todo {
  id?: string
  text: string
}

router.get('/todos', async (ctx) => {
  const todos = await getDb().collection('todos').find() // { _id: ObjectId(), text: string }[
  const transformedTodos = todos.map(
    (todo: { _id: ObjectId; text: string }) => {
      return {
        id: todo._id.$oid, // a property provided by the Mongo library on the docs it fetches from MongoDB
        text: todo.text
      }
    }
  )
  ctx.response.body = { todos: transformedTodos }
})

router.post('/todos', async (ctx) => {
  const data = await ctx.request.body().value
  const newTodo: Todo = { text: data.text }
  const id = await getDb().collection('todos').insertOne(newTodo)
  newTodo.id = id.$oid
  ctx.response.body = { message: 'Created todo.' }
})

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId! // this will never be undefined
  const data = await ctx.request.body().value
  await getDb()
    .collection('users')
    .updateOne({ _id: ObjectId(tid) }, { $set: { text: data.text } })

  ctx.response.body = { message: 'Updated todo.' }
})

router.delete('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!
  await getDb()
    .collection('todos')
    .deleteOne({ _id: ObjectId(tid)})

  ctx.response.body = { message: 'Deleted todo.' }
})

export default router