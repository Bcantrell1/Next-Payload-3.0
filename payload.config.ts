import { COLLECTION_SLUG_MEDIA, media, pages, sessions, users } from '@/payload/collections'
import { siteSettings } from '@/payload/globals/site-settings'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import nodemailer from 'nodemailer'
import path from 'path'
import { buildConfig } from 'payload/config'
import { en } from 'payload/i18n/en'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storageAdapter = s3Adapter({
  config: {
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    }
  },
  bucket: process.env.NEXT_PUBLIC_S3_BUCKET as string,
  acl: 'public-read'
})

export default buildConfig({
  editor: lexicalEditor(),
  globals: [siteSettings],
  collections: [users, pages, media, sessions],
  secret: process.env.AUTH_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || ''
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'donotreply@zr1tampa.com',
    defaultFromName: 'Zr1 Tampa Admin',
    transport: nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      auth: {
        user: 'resend',
        pass: process.env.AUTH_RESEND_KEY
      }
    })
  }),
  i18n: {
    supportedLanguages: { en }
  },
  plugins: [
    cloudStorage({
      collections: {
        [COLLECTION_SLUG_MEDIA]: {
          adapter: storageAdapter,
          disablePayloadAccessControl: true,
          generateFileURL: (args: any) => {
            return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${args.filename}`
          }
        }
      }
    })
  ],
  sharp
})
