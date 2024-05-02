import Container from '@/components/Container'
import LexicalContent from '@/components/LexicalContent'
import Image from 'next/image'
import { HeroBannerBlock } from '~/payload-types'

const HeroBanner = ({ content, backgroundImage, blockIndex }: HeroBannerBlock & { blockIndex: number }) => {
  const imageSrc = typeof backgroundImage === 'object' ? backgroundImage?.url : null
  return (
    <section className="flex h-[50dvh] min-h-[500px]">
      <div className="relative z-10 flex grow items-center">
        <Container>
          <div className="prose prose-lg dark:prose-invert">
            {/**@ts-ignore */}
            <LexicalContent childrenNodes={content.root.children} locale={'en'} lazyLoadImages={blockIndex < 2} />
          </div>
        </Container>
      </div>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          loading={blockIndex > 2 ? 'lazy' : 'eager'}
          className="max-h-[1000px] object-cover object-top [mask-image:_linear-gradient(to_top,transparent_250px,_theme(colors.zinc.940))]"
        />
      )}
    </section>
  )
}

export default HeroBanner
