import { Application } from "https://deno.land/x/oak/mod.ts"

import todosRoutes from './routes/todos.ts'
import { connect } from './helpers/db_client.ts'

connect()

const app = new Application()

// if any of your next-in-line middleware is async they will return promises and you should async/await ALL your middlewares
app.use(async (ctx, next) => {
  console.log('Middleware')
  await next()
})

app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*') // every domain may access this server
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  await next()
})

app.use(todosRoutes.routes())
app.use(todosRoutes.allowedMethods())

await app.listen({ port: 8000 })