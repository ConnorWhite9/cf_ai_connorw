import { PlantPalContainer } from "./Container";
import { PlantPalHeader } from "./Header";
import  { Background } from "./Background";

interface PlantPalLayoutProps {
  children: React.ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
  headerRightContent?: React.ReactNode;
}

export const PlantPalLayout: React.FC<PlantPalLayoutProps> = ({ 
  children, 
  showAddButton = true,
  onAddClick,
  maxWidth = '7xl',
  headerRightContent
}) => {
  return (
    <Background>
      <PlantPalHeader 
        showAddButton={showAddButton} 
        onAddClick={onAddClick}
        rightContent={headerRightContent}
      />
      <PlantPalContainer maxWidth={maxWidth}>
        {children}
      </PlantPalContainer>
    </Background>
  );
};