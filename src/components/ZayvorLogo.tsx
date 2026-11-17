import { ProtectedMedia } from './ProtectedMedia';

interface ZayvorLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function ZayvorLogo({ size = 'md' }: ZayvorLogoProps) {
  const sizeClass =
    size === 'lg'
      ? 'h-12 sm:h-14 w-[92px] sm:w-[106px]'
      : size === 'sm'
        ? 'h-8 w-[60px]'
        : 'h-10 sm:h-11 w-[74px] sm:w-[82px]';

  return (
    <span className="inline-flex items-center whitespace-nowrap shrink-0 select-none">
      <ProtectedMedia
        src="/zayvorlogo.png"
        alt="Zayvor Sports Industries"
        objectFit="contain"
        className={sizeClass}
      />
    </span>
  );
}
