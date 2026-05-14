import Image from 'next/image'
import { FC, memo, MouseEventHandler } from 'react'

interface PictureProps {
  src: string
  alt?: string
  className: string
  priority?: boolean
  onClick?: MouseEventHandler<HTMLImageElement>
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'empty' | 'blur' | 'data:image/...'
  blurDataURL?: string
}

const Picture: FC<PictureProps> = ({
  src,
  alt,
  className,
  priority = false,
  onClick,
  width,
  height,
  fill,
  sizes = '100vw',
  quality,
  placeholder,
  blurDataURL
}) => {
  if (fill) {
    return (
      <Image
        onClick={onClick}
        src={src}
        alt={alt || 'The Pops'}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        style={{ objectFit: 'cover' }}
      />
    )
  }

  const hasFixedHeight = className?.includes('h-') && !className?.includes('h-auto') && !className?.includes('h-full')

  return (
    <Image
      onClick={onClick}
      src={src}
      alt={alt || 'The Pops'}
      width={width || 500}
      height={hasFixedHeight ? height || 500 : 500}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      decoding="async"
      style={{
        height: hasFixedHeight ? undefined : 'auto'
      }}
    />
  )
}

export default memo(Picture)
