'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { addCollaborator, getCollaborators, updateDocument, deleteDocument } from '../../lib/db';
import { uploadCollaboratorLogo, deleteCollaboratorLogo } from '../../lib/storage';
import { useForm } from 'react-hook-form';

interface DatabaseCollaborator {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  featured: boolean;
}

interface Collaborator {
  id?: string;
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  featured: boolean;
}

const CollaboratorsManager = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [editingItem, setEditingItem] = useState<Collaborator | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Collaborator>();

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    const collaboratorsData = await getCollaborators();
    // Map database fields to component fields
    const mappedData = (collaboratorsData as DatabaseCollaborator[]).map(collab => ({
      ...collab,
      logoUrl: collab.logo_url,
      websiteUrl: collab.website_url
    }));
    setCollaborators(mappedData);
  };

  const onSubmit = async (data: Collaborator) => {
    try {
      setUploading(true);
      let logoUrl = data.logoUrl;

      // Handle file upload if a new file is selected
      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        logoUrl = await uploadCollaboratorLogo(selectedFile, fileName);

        // If editing and had an old logo, delete it
        if (editingItem?.logoUrl && editingItem.logoUrl !== logoUrl) {
          try {
            await deleteCollaboratorLogo(editingItem.logoUrl);
          } catch (error) {
            console.warn('Could not delete old logo:', error);
          }
        }
      }

      const collaboratorData = {
        name: data.name,
        description: data.description,
        logoUrl,
        websiteUrl: data.websiteUrl,
        featured: data.featured
      };

      if (editingItem?.id) {
        // Map to database field names for update
        const updateData = {
          name: collaboratorData.name,
          description: collaboratorData.description,
          logo_url: collaboratorData.logoUrl,
          website_url: collaboratorData.websiteUrl,
          featured: collaboratorData.featured
        };
        await updateDocument('collaborators', editingItem.id, updateData);
      } else {
        await addCollaborator(collaboratorData);
      }

      reset();
      setEditingItem(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      loadCollaborators();
    } catch (error) {
      console.error('Error saving collaborator:', error);
      alert('Error saving collaborator. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: Collaborator) => {
    setEditingItem(item);
    setValue('name', item.name);
    setValue('description', item.description);
    setValue('logoUrl', item.logoUrl || '');
    setValue('websiteUrl', item.websiteUrl || '');
    setValue('featured', item.featured);
    setPreviewUrl(item.logoUrl || null);
    setSelectedFile(null);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this collaborator?')) {
      const collaborator = collaborators.find(c => c.id === id);

      // Delete the logo file if it exists
      if (collaborator?.logoUrl) {
        try {
          await deleteCollaboratorLogo(collaborator.logoUrl);
        } catch (error) {
          console.warn('Could not delete logo file:', error);
        }
      }

      await deleteDocument('collaborators', id);
      loadCollaborators();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        alert('Please select a PNG or JPG image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    reset();
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
              rows={6}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter collaborator description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Logo Upload (PNG or JPG)</label>
            <div className="space-y-4">
              {/* File input */}
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleFileSelect}
                className="w-full border rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary-600 file:text-white hover:file:bg-primary-700"
              />

              {/* Preview */}
              {previewUrl && (
                <div className="flex items-center space-x-4">
                  <Image
                    src={previewUrl}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain rounded border"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? 'New file selected' : 'Current logo'}
                  </span>
                </div>
              )}

              {/* URL input as fallback */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Or enter logo URL</label>
                <input
                  {...register('logoUrl')}
                  type="url"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
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
              disabled={uploading}
              className={`px-4 py-2 rounded-lg text-white ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingItem ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                `${editingItem ? 'Update' : 'Add'} Collaborator`
              )}
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={uploading}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
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