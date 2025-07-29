const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  href,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center transform hover:-translate-y-0.5'
  
  const variants = {
    primary: 'bg-[#fe0000] text-white hover:bg-[#cd1718] shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white',
    cta: 'bg-[#DBDBDB] text-[#1a1a1a] hover:bg-gray-300 hover:shadow-lg',
    accent: 'bg-[#fe0000] text-white hover:bg-[#cd1718] shadow-lg hover:shadow-xl',
    ghost: 'text-[#fe0000] hover:bg-[#fe0000] hover:bg-opacity-10',
    outline: 'border-2 border-[#fe0000] text-[#fe0000] hover:bg-[#fe0000] hover:text-white',
    dark: 'bg-[#1a1a1a] text-white hover:bg-gray-800'
  }
  
  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    )
  }
  
  return (
    <button 
      onClick={onClick} 
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button