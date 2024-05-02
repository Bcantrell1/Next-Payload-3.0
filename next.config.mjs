import initBundleAnalyzer from '@next/bundle-analyzer'
import { withPayload } from '@payloadcms/next/withPayload'

const withBundleAnalyzer = initBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.S3_PROTOCOL,
        hostname: process.env.S3_HOSTNAME,
        port: '',
        pathname: '/**'
      }
    ]
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack']
      }
    )
    fileLoaderRule.exclude = /\.svg$/i

    return config
  }
}

export default withBundleAnalyzer(withPayload(nextConfig))
