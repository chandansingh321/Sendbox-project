import { MongoClient } from 'mongodb'
import dns from 'dns'

// Force IPv4 resolution to prevent NAT64 / IPv6 handshake drops with Atlas
try {
  dns.setDefaultResultOrder('ipv4first')
} catch {
  // Ignore in environments where not supported
}

const uri = process.env.MONGODB_URI || ''
const options = {
  family: 4,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export const isMongoConfigured = Boolean(
  uri && !uri.includes('<username>') && !uri.includes('<password>')
)

export async function getMongoDb(dbName = 'rapid_review') {
  if (!clientPromise) {
    throw new Error('MONGODB_URI is not set in environment variables')
  }
  const connectedClient = await clientPromise
  return connectedClient.db(dbName)
}

export default clientPromise
