import React, { useState } from 'react';
import { Leaf, Plus, Search, Droplets, Sun, MapPin} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlantPalHeader } from '../components/Header';
import { useAuth } from '../utils/auth';


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

// Mock plant data
const mockPlants: Plant[] = [
  {
    plantId: "plant_1",
    name: "Spike",
    species: {
      commonName: "Snake Plant",
      scientificName: "Sansevieria trifasciata"
    },
    imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400",
    care: {
      light: "low",
      wateringFrequencyDays: 14,
      soilType: "well-draining",
      fertilizerFrequencyDays: 60
    },
    location: {
      room: "Living Room",
      windowDirection: "north"
    },
    schedule: {
      lastWatered: "2024-12-20"
    },
    notes: "Very low maintenance, perfect for beginners",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z"
  },
  {
    plantId: "plant_2",
    name: "Monstera Mike",
    species: {
      commonName: "Monstera",
      scientificName: "Monstera deliciosa"
    },
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    care: {
      light: "bright",
      wateringFrequencyDays: 7,
      soilType: "standard",
      fertilizerFrequencyDays: 30
    },
    location: {
      room: "Bedroom",
      windowDirection: "east"
    },
    schedule: {
      lastWatered: "2024-12-25"
    },
    notes: "Loves humidity, mist regularly",
    createdAt: "2024-02-10T12:00:00Z",
    updatedAt: "2024-12-25T09:15:00Z"
  },
  {
    plantId: "plant_3",
    name: "Prickly Pete",
    species: {
      commonName: "Golden Barrel Cactus",
      scientificName: "Echinocactus grusonii"
    },
    imageUrl: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400",
    care: {
      light: "direct",
      wateringFrequencyDays: 21,
      soilType: "cactus",
      fertilizerFrequencyDays: 90
    },
    location: {
      room: "Office",
      windowDirection: "south"
    },
    schedule: {
      lastWatered: "2024-12-10"
    },
    notes: "Needs lots of sun, don't overwater!",
    createdAt: "2024-03-05T15:30:00Z",
    updatedAt: "2024-12-10T11:20:00Z"
  },
  {
    plantId: "plant_4",
    name: "Fern Gully",
    species: {
      commonName: "Boston Fern",
      scientificName: "Nephrolepis exaltata"
    },
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400",
    care: {
      light: "medium",
      wateringFrequencyDays: 3,
      soilType: "standard",
      fertilizerFrequencyDays: 30
    },
    location: {
      room: "Bathroom",
      windowDirection: "none"
    },
    schedule: {
      lastWatered: "2024-12-28"
    },
    notes: "Loves humidity, keep soil moist",
    createdAt: "2024-04-20T08:00:00Z",
    updatedAt: "2024-12-28T07:45:00Z"
  }
];

const PlantCard = ({ plant, onClick }: { plant: Plant; onClick: () => void }) => {
  const getDaysUntilWatering = () => {
    const lastWatered = new Date(plant.schedule.lastWatered);
    const today = new Date();
    const daysSinceWatered = Math.floor((today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilNext = plant.care.wateringFrequencyDays - daysSinceWatered;
    return daysUntilNext;
  };

  const daysUntilWatering = getDaysUntilWatering();
  const needsWater = daysUntilWatering <= 0;

  const getLightIcon = (light: string) => {
    const colors: any = {
      low: "text-gray-400",
      medium: "text-yellow-400",
      bright: "text-amber-400",
      direct: "text-orange-400"
    };
    return colors[light] || "text-yellow-400";
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl overflow-hidden border border-green-900/30 hover:border-emerald-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        {needsWater && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            Needs Water!
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-emerald-100" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
              {plant.name}
            </h3>
            <p className="text-sm text-emerald-300">{plant.species.commonName}</p>
            <p className="text-xs text-gray-500 italic">{plant.species.scientificName}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Sun className={`w-4 h-4 ${getLightIcon(plant.care.light)}`} />
            <span className="capitalize">{plant.care.light} Light</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>
              {needsWater 
                ? `Overdue by ${Math.abs(daysUntilWatering)} day${Math.abs(daysUntilWatering) !== 1 ? 's' : ''}`
                : `Water in ${daysUntilWatering} day${daysUntilWatering !== 1 ? 's' : ''}`
              }
            </span>
          </div>

          {plant.location.room && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{plant.location.room}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchInput = ({ value, onChange }: any) => (
  <div className="relative">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search your plants..."
      className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-100 placeholder-gray-500"
    />
  </div>
);


export default function PlantPalHome() {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Quicksand:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const [plants, setPlants] = useState<Plant[]>([]);
  const token = useAuth();

    React.useEffect(() => {
    const grabPlants = async () => {
      try {
        const res = await fetch("/api/grabAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch plants");
        }

        const data = await res.json();
        console.log("Fetched plants:", data);
        setPlants(data ?? []); // ✅ fallback to empty array

      } catch (err) {
        console.error("Error fetching plants:", err);
        setPlants([]); // safe fallback
      }
    };
    grabPlants(); // ✅ call the async function\
  

  }, []); // ✅ run once on mount


  const navigate = useNavigate();

  //const [plants] = useState<Plant[]>(mockPlants);
  const [searchQuery, setSearchQuery] = useState('');

  /*const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.species.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );*/

  const filteredPlants = plants;

  const handleAddPlant = () => {
    navigate("/add");
  };

  const plantsNeedingWater = plants.filter(plant => {
    const lastWatered = new Date(plant.schedule.lastWatered);
    const today = new Date();
    const daysSinceWatered = Math.floor((today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilNext = plant.care.wateringFrequencyDays - daysSinceWatered;
    return daysUntilNext <= 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-emerald-950" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      {/* Header */}
      <PlantPalHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats and Search */}
        <div className="mb-8 space-y-4">
          {plantsNeedingWater.length > 0 && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex justify-center items-center gap-4">
              <Droplets className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-200 font-semibold text-center">
                  {plantsNeedingWater.length} plant{plantsNeedingWater.length !== 1 ? 's' : ''} need{plantsNeedingWater.length === 1 ? 's' : ''} watering!
                </p>
                <p className="text-red-300 text-sm text-center">
                  {plantsNeedingWater.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-emerald-100" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
                My Collection
              </h2>
              <p className="text-emerald-300 text-sm mt-1">
                {plants.length} plant{plants.length !== 1 ? 's' : ''} growing strong
              </p>
            </div>
            
            <div className="w-full md:w-96">
              <SearchInput
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Plants Grid */}
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map(plant => (
              <PlantCard
                key={plant.plantId}
                plant={plant}
                onClick={() => navigate(`/chat/${plant.plantId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No plants found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Add your first plant to get started!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}