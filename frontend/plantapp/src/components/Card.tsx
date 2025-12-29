export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200
        ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};