import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type {Plant} from '../../types/index';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PlantCard } from '../components/PlantCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants');
      const data = await response.json();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      // Demo data
      setPlants([
        {
          id: '1',
          name: 'Monstera',
          species: 'Monstera deliciosa',
          location: 'Living Room',
          lastWatered: '2024-12-25',
          wateringFrequency: 7,
          sunlightRequirement: 'medium',
          healthStatus: 'healthy'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Plants</h1>
          <Button onClick={() => navigate('/add')}>Add Plant</Button>
        </div>

        {plants.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No plants yet</p>
            <Button onClick={() => navigate('/add')}>Add Your First Plant</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onClick={() => navigate(`/plant/${plant.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;