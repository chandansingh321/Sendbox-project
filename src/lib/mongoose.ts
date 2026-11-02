import mongoose from 'mongoose'
import dns from 'dns'

// Force IPv4 resolution to prevent NAT64 / IPv6 handshake drops with Atlas
try {
  dns.setDefaultResultOrder('ipv4first')
} catch {
  // Ignore in environments where not supported
}

const MONGODB_URI = process.env.MONGODB_URI || ''

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

let cached = global.mongooseCache

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null }
}

export async function connectMongoose(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: 'rapid_review',
      family: 4,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default connectMongoose
