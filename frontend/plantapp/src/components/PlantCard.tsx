import type {Plant} from '../../types/index';
import { Badge } from './Badge';
import { Card } from './Card';

export const PlantCard: React.FC<{
  plant: Plant;
  onClick?: () => void;
}> = ({ plant }) => {
  const daysUntilWater = Math.ceil(
    (new Date(plant.lastWatered).getTime() +
      plant.wateringFrequency * 24 * 60 * 60 * 1000 -
      Date.now()) /
      (24 * 60 * 60 * 1000)
  );


  return (
      <Card hover onClick={() => {}}>
        
        <div className="relative pointer-envents-none">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-xl flex items-center justify-center">
            <span className="text-6xl">🌿</span>
          </div>
        )}
        <div className="absolute top-3 right-3 pointer-events-none">
          <Badge status={plant.healthStatus} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
          <p className="text-sm text-gray-600">{plant.species}</p>
          {plant.commonName && (
            <p className="text-xs text-gray-500 italic">{plant.commonName}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <span>💧</span>
            <span>
              {daysUntilWater > 0
                ? `Water in ${daysUntilWater}d`
                : 'Needs water!'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <span>☀️</span>
            <span className="capitalize">{plant.sunlightRequirement}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <span>📍</span>
          <span>{plant.location}</span>
        </div>
      </div>
      
    </Card>
    
  );
};