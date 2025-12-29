export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  icon
}) => {
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};