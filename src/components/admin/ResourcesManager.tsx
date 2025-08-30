'use client';
import { useState, useEffect } from 'react';
import { addResource, getResources, updateDocument, deleteDocument } from '../../lib/db';
import { useForm } from 'react-hook-form';

interface Resource {
  id?: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  externalUrl?: string;
  [key: string]: unknown;
}

const ResourcesManager = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingItem, setEditingItem] = useState<Resource | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Resource>();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const resourcesData = await getResources();
    setResources(resourcesData as Resource[]);
  };

  const onSubmit = async (data: Resource) => {
    try {
      if (editingItem?.id) {
        await updateDocument('resources', editingItem.id, data);
      } else {
        await addResource(data);
      }
      reset();
      setEditingItem(null);
      loadResources();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleEdit = (item: Resource) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('description', item.description);
    setValue('category', item.category);
    setValue('fileUrl', item.fileUrl || '');
    setValue('externalUrl', item.externalUrl || '');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      await deleteDocument('resources', id);
      loadResources();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Edit Resource' : 'Add Resource'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              {...register('title', { required: true })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter resource title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description', { required: true })}
              rows={4}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter resource description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              {...register('category', { required: true })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter category (e.g., Agricultural, Community, Framework)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">File URL (optional)</label>
            <input
              {...register('fileUrl')}
              type="url"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="URL to uploaded file"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">External URL (optional)</label>
            <input
              {...register('externalUrl')}
              type="url"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="External website URL"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {editingItem ? 'Update' : 'Add'} Resource
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

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b">Resources</h2>
        <div className="divide-y">
          {resources.map((item) => (
            <div key={item.id} className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {item.category}
                  </span>
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      📎 File
                    </a>
                  )}
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      🔗 External Link
                    </a>
                  )}
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

export default ResourcesManager;