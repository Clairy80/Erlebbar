import React, { useState } from 'react';
import CreateEventForm from './CreateEventForm';
import CreateLocationForm from './CreateLocationForm';

const OrganizerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const token = localStorage.getItem('token');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">🎟️ Veranstalter Dashboard</h2>

      <div className="flex gap-2 mb-4">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
          onClick={() => setActiveTab('events')}
        >
          📅 Events verwalten
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'locations' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
          onClick={() => setActiveTab('locations')}
        >
          📍 Locations verwalten
        </button>
      </div>

      {activeTab === 'events' && (
        <section>
          <CreateEventForm token={token} />
        </section>
      )}

      {activeTab === 'locations' && (
        <section>
          <CreateLocationForm token={token} />
        </section>
      )}
    </div>
  );
};

export default OrganizerDashboardPage;
