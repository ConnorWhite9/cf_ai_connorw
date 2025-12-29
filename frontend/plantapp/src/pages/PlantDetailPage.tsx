import { useParams, useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from "react";
import type {Plant, CareMessage} from '../../types/index';
import { Card } from '../components/Card';
import { Button } from '../components/Button';


const PlantDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [messages, setMessages] = useState<CareMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlant();
    fetchMessages();
  }, [id]);

  const fetchPlant = async () => {
    try {
      const response = await fetch(`/api/plants/${id}`);
      const data = await response.json();
      setPlant(data);
    } catch (error) {
      console.error('Error:', error);
      // Demo data
      setPlant({
        id: id!,
        name: 'Monstera',
        species: 'Monstera deliciosa',
        location: 'Living Room',
        lastWatered: '2024-12-25',
        wateringFrequency: 7,
        sunlightRequirement: 'medium',
        healthStatus: 'healthy',
        notes: 'Beautiful plant'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/plants/${id}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setMessages([]);
    }
  };

  const handleWater = async () => {
    try {
      await fetch(`/api/plants/${id}/water`, { method: 'POST' });
      if (plant) {
        setPlant({ ...plant, lastWatered: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');

    try {
      const response = await fetch(`/api/plants/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      
      setMessages([...messages, {
        id: Date.now().toString(),
        message: userMessage,
        response: data.response,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!plant) {
    return <div className="flex justify-center items-center min-h-screen">Plant not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plant Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h1 className="text-2xl font-bold mb-2">{plant.name}</h1>
              <p className="text-gray-600 mb-4">{plant.species}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{plant.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunlight</span>
                  <span className="font-medium capitalize">{plant.sunlightRequirement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Every</span>
                  <span className="font-medium">{plant.wateringFrequency} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Watered</span>
                  <span className="font-medium">
                    {new Date(plant.lastWatered).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {plant.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-700">{plant.notes}</p>
                </div>
              )}

              <Button onClick={handleWater} fullWidth >
                💧 Water Now
              </Button>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="flex flex-col h-[600px]">
              <div className="p-4 border-b">
                <h2 className="font-semibold">AI Care Assistant</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    Ask me anything about caring for your {plant.name}
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="bg-green-600 text-white rounded-lg p-3 max-w-[80%]">
                          {msg.message}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          {msg.response}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask about care instructions..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button type="submit">Send</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PlantDetailPage };