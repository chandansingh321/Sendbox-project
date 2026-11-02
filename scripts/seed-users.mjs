import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is not set in environment or .env.local')
  process.exit(1)
}

const client = new MongoClient(uri)

async function main() {
  try {
    await client.connect()
    console.log('✓ Successfully connected to MongoDB Atlas')
    const db = client.db('rapid_review')
    const usersCollection = db.collection('users')

    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true })

    const adminUser = {
      email: 'admin@teraneuro.com',
      name: 'System Administrator',
      role: 'admin',
      isActive: true,
      assignedQueues: ['q-hume'],
      createdBy: 'system',
      currentTaskId: null,
      lastLoginAt: null,
    }

    const standardUser = {
      email: 'chandan.singh2@teraneuro.com',
      name: 'Chandan Singh',
      role: 'user',
      isActive: true,
      assignedQueues: ['q-hume'],
      createdBy: 'admin@teraneuro.com',
      currentTaskId: null,
      lastLoginAt: null,
    }

    const adminResult = await usersCollection.updateOne(
      { email: adminUser.email },
      {
        $set: {
          ...adminUser,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    const userResult = await usersCollection.updateOne(
      { email: standardUser.email },
      {
        $set: {
          ...standardUser,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    console.log(`✓ Admin user (${adminUser.email}): ${adminResult.upsertedCount ? 'created' : 'updated'}`)
    console.log(`✓ Standard user (${standardUser.email}): ${userResult.upsertedCount ? 'created' : 'updated'}`)

    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray()
    console.log('\nAll users in database:')
    console.log(users)
  } catch (err) {
    console.error('Database seeding failed:', err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()
