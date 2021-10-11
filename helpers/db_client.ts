import { MongoClient, Database } from "https://deno.land/x/mongo@v0.9.1/mod.ts"

let db: Database

export function connect() {
  const client = new MongoClient()
  client.connectWithUri('mongodb+srv://brogan_nodejs:BU7jMiFAv79OOfsN@cluster0-lxdbd.mongodb.net/')
  db = client.database('todos')
}

export function getDb() {
  return db
}