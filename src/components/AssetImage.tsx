import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import { assetImageUrl } from '@/lib/assetImage';

interface AssetImageProps extends Omit<ComponentProps<'img'>, 'src' | 'alt'> {
  src: string;
  alt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageFit?: 'cover' | 'scale-down' | 'contain';
  imageQuality?: number;
}

function AssetImage({
  src,
  alt,
  imageWidth,
  imageHeight,
  imageFit,
  imageQuality,
  onError,
  ...props
}: AssetImageProps) {
  const transformedSrc = useMemo(
    () =>
      imageWidth
        ? assetImageUrl(src, {
            width: imageWidth,
            height: imageHeight,
            fit: imageFit,
            quality: imageQuality,
          })
        : src,
    [src, imageWidth, imageHeight, imageFit, imageQuality],
  );
  const [currentSrc, setCurrentSrc] = useState(transformedSrc);

  useEffect(() => {
    setCurrentSrc(transformedSrc);
  }, [transformedSrc]);

  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      alt={alt}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== src) {
          setCurrentSrc(src);
          return;
        }
        onError?.(event);
      }}
    />
  );
}

export { AssetImage };
