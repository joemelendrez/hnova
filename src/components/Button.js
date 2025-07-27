const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  href,
  className = '',
  ...props
}) => {
  // Base styles that all buttons share
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center';

  // Different button styles
  const variants = {
    primary: 'bg-[#1a1a1a] text-white hover:bg-gray-800 hover:shadow-lg',
    secondary:
      'border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white',
    ghost: 'text-[#1a1a1a] hover:bg-[#DBDBDB]',
    cta: 'bg-[#DBDBDB] text-[#1a1a1a] hover:bg-gray-300 hover:shadow-lg',
    dark: 'bg-[#1a1a1a] text-white hover:bg-gray-800',
  };

  // Different button sizes
  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  // Combine all styles
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // If href is provided, render as link
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button onClick={onClick} className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
