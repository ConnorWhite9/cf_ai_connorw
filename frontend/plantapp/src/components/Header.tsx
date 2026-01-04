// Header component
import { Leaf, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlantPalHeaderProps {
  showAddButton?: boolean;
  onAddClick?: () => void;
  rightContent?: React.ReactNode;
}

export const PlantPalHeader: React.FC<PlantPalHeaderProps> = ({ 
  showAddButton = true, 
  onAddClick,
  rightContent 
}) => {
  const navigate = useNavigate();
  
  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      navigate('/add');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-gray-800/50 border-b border-green-900/30 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <Leaf className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-emerald-100" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
            PlantPal
          </h1>
        </div>
        
        {rightContent || (showAddButton && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg hover:shadow-emerald-500/50"
          >
            <Plus className="w-5 h-5" />
            Add Plant
          </button>
        ))}
      </div>
    </header>
  );
};