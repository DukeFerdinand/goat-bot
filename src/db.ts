import dotenv from 'dotenv'
import { Firestore } from '@google-cloud/firestore'

export const dbConnection = (): Firestore => {
  dotenv.config()
  if (process.env.GCP_PROJECT_ID && process.env.GCP_PROJECT_KEYFILE) {
    return new Firestore({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_PROJECT_KEYFILE,
    })
  } else {
    throw new Error(
      'Could not find GCP_PROJECT_ID or GCP_PROJECT_KEYFILE in env',
    )
  }
}
