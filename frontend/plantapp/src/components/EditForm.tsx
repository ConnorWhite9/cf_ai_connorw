import React, { useState } from 'react';
import type { Plant } from '../../types/index';
import { Card } from './Card';
import { Save, X, Upload, Camera } from 'lucide-react';

interface PlantEditFormProps {
  plant: Plant;
  onSave: (updatedPlant: Plant) => void | Promise<void>;
  onCancel: () => void;
}

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

export const PlantEditForm: React.FC<PlantEditFormProps> = ({
  plant,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Plant>(plant);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(plant.imageUrl || null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          imageUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving plant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-emerald-100" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
            Edit Plant
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-emerald-200">
            Plant Image
          </label>
          <div className="relative">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Plant preview"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="image-upload"
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white" />
                </label>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-green-800 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-gray-700/50"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Click to upload image</span>
              </label>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-emerald-200">
              Plant Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100 placeholder-gray-500"
              placeholder="e.g., Monstera Mike"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="species" className="block text-sm font-medium text-emerald-200">
              Species *
            </label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100 placeholder-gray-500"
              placeholder="e.g., Monstera deliciosa"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="commonName" className="block text-sm font-medium text-emerald-200">
              Common Name
            </label>
            <input
              type="text"
              id="commonName"
              name="commonName"
              value={formData.commonName || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100 placeholder-gray-500"
              placeholder="e.g., Swiss Cheese Plant"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-emerald-200">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100 placeholder-gray-500"
              placeholder="e.g., Living Room"
            />
          </div>
        </div>

        {/* Care Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="sunlightRequirement" className="block text-sm font-medium text-emerald-200">
              Sunlight Requirement *
            </label>
            <select
              id="sunlightRequirement"
              name="sunlightRequirement"
              value={formData.sunlightRequirement}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100"
            >
              <option value="low">Low Light</option>
              <option value="medium">Medium Light</option>
              <option value="bright">Bright Indirect</option>
              <option value="direct">Direct Sunlight</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="wateringFrequency" className="block text-sm font-medium text-emerald-200">
              Watering Frequency (days) *
            </label>
            <input
              type="number"
              id="wateringFrequency"
              name="wateringFrequency"
              value={formData.wateringFrequency}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastWatered" className="block text-sm font-medium text-emerald-200">
              Last Watered *
            </label>
            <input
              type="date"
              id="lastWatered"
              name="lastWatered"
              value={formData.lastWatered}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="healthStatus" className="block text-sm font-medium text-emerald-200">
              Health Status *
            </label>
            <select
              id="healthStatus"
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100"
            >
              <option value="healthy">Healthy</option>
              <option value="needs attention">Needs Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium text-emerald-200">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-green-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-100 placeholder-gray-500 resize-none"
            placeholder="Additional care notes..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-emerald-500/50"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}; 