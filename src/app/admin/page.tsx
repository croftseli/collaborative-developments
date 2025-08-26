'use client';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { redirect } from 'next/navigation';
import NewsManager from '../../components/admin/NewsManager';
import ResourcesManager from '../../components/admin/ResourcesManager';
import CollaboratorsManager from '../../components/admin/CollaboratorsManager';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('news');

  if (loading) return <div>Loading...</div>;
  if (!user) redirect('/login');

  const tabs = [
    { id: 'news', label: 'News Updates' },
    { id: 'resources', label: 'Resources' },
    { id: 'collaborators', label: 'Collaborators' },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'news' && <NewsManager />}
        {activeTab === 'resources' && <ResourcesManager />}
        {activeTab === 'collaborators' && <CollaboratorsManager />}
      </div>
    </div>
  );
}