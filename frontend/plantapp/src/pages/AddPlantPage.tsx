import React, { useState } from 'react';
import { Leaf, Droplets, Sun, MapPin, Calendar, FileText } from 'lucide-react';
import TextInput from '../components/TextInput';
import Select from '../components/Select';
import NumberInput from '../components/NumberInput';
import SectionHeader from '../components/Sectionheader';


interface PlantFormData {
  name: string;
  commonName: string;
  scientificName: string;
  imageUrl: string;
  light: string;
  wateringFrequencyDays: number;
  soilType: string;
  fertilizerFrequencyDays: number;
  room: string;
  windowDirection: string;
  lastWatered: string;
  notes: string;
}

const lightOptions = [
  { value: 'low', label: 'Low Light' },
  { value: 'medium', label: 'Medium Light' },
  { value: 'high', label: 'High Light' }
];

const soilOptions = [
  { value: 'standard', label: 'Standard Potting Mix' },
  { value: 'cactus', label: 'Cactus/Succulent Mix' },
  { value: 'orchid', label: 'Orchid Mix' }
]

const windowOptions = [
  { value: 'none', label: 'No Window' },
  { value: 'north', label: 'North-facing' },
  { value: 'south', label: 'South-facing' },
  { value: 'east', label: 'East-facing' },
  { value: 'west', label: 'West-facing' }
]

export default function AddPlantPage() {
  // Load custom fonts
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Quicksand:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const [formData, setFormData] = useState<PlantFormData>({
    name: '',
    commonName: '',
    scientificName: '',
    imageUrl: '',
    light: 'medium',
    wateringFrequencyDays: 7,
    soilType: 'standard',
    fertilizerFrequencyDays: 30,
    room: '',
    windowDirection: 'none',
    lastWatered: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = () => {
    const plantData = {
      plantId: `plant_${Date.now()}`,
      name: formData.name,
      species: {
        commonName: formData.commonName,
        scientificName: formData.scientificName
      },
      imageUrl: formData.imageUrl,
      care: {
        light: formData.light,
        wateringFrequencyDays: formData.wateringFrequencyDays,
        soilType: formData.soilType,
        fertilizerFrequencyDays: formData.fertilizerFrequencyDays
      },
      location: {
        room: formData.room,
        windowDirection: formData.windowDirection
      },
      schedule: {
        lastWatered: formData.lastWatered
      },
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Plant Data:', plantData);
    alert('Plant added successfully! Check console for data.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Days') ? parseInt(value) || 0 : value
    }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      commonName: '',
      scientificName: '',
      imageUrl: '',
      light: 'medium',
      wateringFrequencyDays: 7,
      soilType: 'standard',
      fertilizerFrequencyDays: 30,
      room: '',
      windowDirection: 'none',
      lastWatered: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-emerald-950 py-12 px-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-green-900/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-800 px-8 py-6 border-b border-emerald-700/30">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-emerald-300" />
              <h1 className="text-3xl font-bold text-emerald-50" style={{ fontFamily: "'Comfortaa', sans-serif" }}>Add New Plant</h1>
            </div>
            <p className="text-emerald-200 mt-2">Help your plant thrive with proper care tracking</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <section>
              <SectionHeader icon={Leaf} title="Basic Information" color="text-emerald-400" />
              <div className="space-y-4">
                <TextInput
                  label="Plant Nickname"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Spike, Fern Gully"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label="Common Name"
                    name="commonName"
                    value={formData.commonName}
                    onChange={handleChange}
                    placeholder="e.g., Snake Plant"
                    required
                  />
                  <TextInput
                    label="Scientific Name"
                    name="scientificName"
                    value={formData.scientificName}
                    onChange={handleChange}
                    placeholder="e.g., Sansevieria trifasciata"
                  />
                </div>

                <TextInput
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/plant-image.jpg"
                />
              </div>
            </section>

            {/* Care Requirements */}
            <section className="border-t border-green-900/50 pt-6">
              <SectionHeader icon={Sun} title="Care Requirements" color="text-amber-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Light Level"
                  name="light"
                  value={formData.light}
                  onChange={handleChange}
                  options={lightOptions}
                  required
                />
                <Select
                  label="Soil Type"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  options={soilOptions}
                  required
                />
                <NumberInput
                  label="Watering Frequency (days)"
                  name="wateringFrequencyDays"
                  value={formData.wateringFrequencyDays}
                  onChange={handleChange}
                  required
                />
                <NumberInput
                  label="Fertilizer Frequency (days)"
                  name="fertilizerFrequencyDays"
                  value={formData.fertilizerFrequencyDays}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>

            {/* Location */}
            <section className="border-t border-green-900/50 pt-6">
              <SectionHeader icon={MapPin} title="Location" color="text-teal-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Room"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="e.g., Living Room, Bedroom"
                />
                <Select
                  label="Window Direction"
                  name="windowDirection"
                  value={formData.windowDirection}
                  onChange={handleChange}
                  options={windowOptions}
                />
              </div>
            </section>

            {/* Schedule */}
            <section className="border-t border-green-900/50 pt-6">
              <SectionHeader icon={Calendar} title="Watering Schedule" color="text-blue-400" />
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-1">
                  Last Watered *
                </label>
                <input
                  type="date"
                  name="lastWatered"
                  value={formData.lastWatered}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-100"
                />
              </div>
            </section>

            {/* Notes */}
            <section className="border-t border-green-900/50 pt-6">
              <SectionHeader icon={FileText} title="Additional Notes" color="text-lime-400" />
              <div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none text-gray-100 placeholder-gray-500"
                  placeholder="Any special care instructions, observations, or reminders..."
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg hover:shadow-emerald-500/50"
              >
                Add Plant to Collection
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border-2 border-green-700 text-emerald-200 font-semibold rounded-lg hover:bg-green-900/30 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}