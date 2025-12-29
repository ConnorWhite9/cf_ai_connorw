import React, {useState, useEffect} from "react";
import type { Plant } from '../../types';
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const AddPlantPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    location: '',
    wateringFrequency: '7',
    sunlightRequirement: 'medium' as Plant['sunlightRequirement'],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          wateringFrequency: parseInt(formData.wateringFrequency),
          lastWatered: new Date().toISOString(),
          healthStatus: 'healthy'
        })
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Add New Plant</h1>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plant Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="My Monstera"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Species *</label>
              <input
                type="text"
                required
                value={formData.species}
                onChange={e => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Monstera deliciosa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Living Room"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Watering Frequency (days) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.wateringFrequency}
                onChange={e => setFormData({ ...formData, wateringFrequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sunlight *</label>
              <select
                value={formData.sunlightRequirement}
                onChange={e => setFormData({ ...formData, sunlightRequirement: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')} fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Add Plant
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export { AddPlantPage };
