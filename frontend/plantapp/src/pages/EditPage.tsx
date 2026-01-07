import { PlantPalLayout } from '../components/Layout';
import { PlantPalChat } from '../components/PlantPalChat';
import { PlantEditForm } from '../components/EditForm';

interface Plant {
  plantId: string;
  name: string;
  species: {
    commonName: string;
    scientificName: string;
  };
  imageUrl: string;
  care: {
    light: string;
    wateringFrequencyDays: number;
    soilType: string;
    fertilizerFrequencyDays: number;
  };
  location: {
    room: string;
    windowDirection: string;
  };
  schedule: {
    lastWatered: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditPage() {  return (
    <PlantPalLayout showAddButton={false} maxWidth='sm'> 
        <div className="h-[80vh]">
            <PlantEditForm plant={plant} />
        </div> 
    </PlantPalLayout>
  );
}