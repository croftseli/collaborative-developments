'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { addCollaborator, getCollaborators, updateDocument, deleteDocument } from '../../lib/db';
import { useForm } from 'react-hook-form';

interface Collaborator {
  id?: string;
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  featured: boolean;
  [key: string]: unknown;
}

const CollaboratorsManager = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [editingItem, setEditingItem] = useState<Collaborator | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Collaborator>();

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    const collaboratorsData = await getCollaborators();
    setCollaborators(collaboratorsData as Collaborator[]);
  };

  const onSubmit = async (data: Collaborator) => {
    try {
      if (editingItem?.id) {
        await updateDocument('collaborators', editingItem.id, data);
      } else {
        await addCollaborator(data);
      }
      reset();
      setEditingItem(null);
      loadCollaborators();
    } catch (error) {
      console.error('Error saving collaborator:', error);
    }
  };

  const handleEdit = (item: Collaborator) => {
    setEditingItem(item);
    setValue('name', item.name);
    setValue('description', item.description);
    setValue('logoUrl', item.logoUrl || '');
    setValue('websiteUrl', item.websiteUrl || '');
    setValue('featured', item.featured);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this collaborator?')) {
      await deleteDocument('collaborators', id);
      loadCollaborators();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Edit Collaborator' : 'Add Collaborator'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              {...register('name', { required: true })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter collaborator name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description', { required: true })}
              rows={4}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter collaborator description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Logo URL (optional)</label>
            <input
              {...register('logoUrl')}
              type="url"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="URL to collaborator logo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Website URL (optional)</label>
            <input
              {...register('websiteUrl')}
              type="url"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Collaborator website URL"
            />
          </div>
          
          <div className="flex items-center">
            <input
              {...register('featured')}
              type="checkbox"
              className="mr-2"
            />
            <label className="text-sm font-medium">Featured collaborator</label>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {editingItem ? 'Update' : 'Add'} Collaborator
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  reset();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Collaborators List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b">Collaborators</h2>
        <div className="divide-y">
          {collaborators.map((item) => (
            <div key={item.id} className="p-6 flex justify-between items-start">
              <div className="flex items-start space-x-4 flex-1">
                {item.logoUrl && (
                  <Image
                    src={item.logoUrl}
                    alt={`${item.name} logo`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {item.featured && (
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        Featured
                      </span>
                    )}
                    {item.websiteUrl && (
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsManager;