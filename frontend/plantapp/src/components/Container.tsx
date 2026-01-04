// Main content container
interface PlantPalContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
}

export const PlantPalContainer: React.FC<PlantPalContainerProps> = ({ 
  children, 
  maxWidth = '7xl' 
}) => {
  const maxWidthClasses: Record<string, string> = {
    'sm': 'min-w-sm',
    'md': 'min-w-md',
    'lg': 'min-w-lg',
    'xl': 'min-w-xl',
    '2xl': 'min-w-2xl',
    '4xl': 'min-w-4xl',
    '7xl': 'min-w-7xl'
  };

  return (
    <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-8`}>
      {children}
    </main>
  );
};
