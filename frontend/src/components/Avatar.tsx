
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
};

export const Avatar = ({ src, alt, size = 'md', className = '' }: AvatarProps) => {
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full bg-primary-100 dark:bg-primary-900/30 
        flex items-center justify-center 
        font-bold text-primary-700 dark:text-primary-300 
        overflow-hidden shrink-0 ring-2 ring-white dark:ring-gray-900
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        (alt?.[0] || '?').toUpperCase()
      )}
    </div>
  );
};
