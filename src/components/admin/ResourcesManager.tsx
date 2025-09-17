'use client';
import { useState, useEffect, useRef } from 'react';
import { addResource, getResources, updateDocument, deleteDocument } from '../../lib/db';
import { uploadResourceFile, deleteResourceFile } from '../../lib/storage';
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      setUploading(true);
      console.log('Starting resource submission:', data);

      let fileUrl = data.fileUrl;

      // Handle file upload if a new file is selected
      if (fileInputRef.current?.files?.[0]) {
        console.log('File detected, starting upload...');
        const file = fileInputRef.current.files[0];
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        try {
          // Delete old file if updating and had a previous file
          if (editingItem?.id) {
            const editingItemWithDbFields = editingItem as Resource & { file_url?: string };
            const oldFileUrl = editingItemWithDbFields.file_url || editingItem.fileUrl;
            if (oldFileUrl) {
              try {
                await deleteResourceFile(oldFileUrl);
                console.log('Old resource file deleted successfully');
              } catch (error) {
                console.warn('Could not delete old resource file:', error);
              }
            }
          }

          fileUrl = await uploadResourceFile(file, fileName);
          console.log('Resource file uploaded successfully:', fileUrl);
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          alert('File upload failed. Please check your file and try again.');
          return;
        }
      }

      // Map the form data to match database field names
      const resourceData = {
        title: data.title,
        description: data.description,
        category: data.category,
        fileUrl: fileUrl || null,
        externalUrl: data.externalUrl || null
      };

      if (editingItem?.id) {
        // For updates, use the correct field names
        const updateData = {
          title: data.title,
          description: data.description,
          category: data.category,
          file_url: fileUrl || null,
          external_url: data.externalUrl || null
        };
        await updateDocument('resources', editingItem.id, updateData);
      } else {
        await addResource(resourceData);
      }

      reset();
      setEditingItem(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Error saving resource. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: Resource) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('description', item.description);
    setValue('category', item.category);
    // Handle database field names (file_url, external_url)
    const itemWithDbFields = item as Resource & { file_url?: string; external_url?: string };
    setValue('fileUrl', itemWithDbFields.file_url || item.fileUrl || '');
    setValue('externalUrl', itemWithDbFields.external_url || item.externalUrl || '');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        // Find the resource to get the file URL
        const resource = resources.find(r => r.id === id);
        if (resource) {
          const resourceWithDbFields = resource as Resource & { file_url?: string };
          const fileUrl = resourceWithDbFields.file_url || resource.fileUrl;
          if (fileUrl) {
            try {
              await deleteResourceFile(fileUrl);
              console.log('Resource file deleted successfully');
            } catch (error) {
              console.warn('Could not delete resource file:', error);
            }
          }
        }
        await deleteDocument('resources', id);
        loadResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource. Please try again.');
      }
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
            <label className="block text-sm font-medium mb-2">
              File Upload <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.avi"
              className="w-full border rounded-lg px-3 py-2 mb-2"
            />
            <p className="text-xs text-gray-500 mb-2">
              Supported: PDF, DOC, XLS, PPT, TXT, ZIP, Images, Videos, Audio files. Max size: 50MB
            </p>

            <label className="block text-sm font-medium mb-2">Or File URL (optional)</label>
            <input
              {...register('fileUrl')}
              type="url"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="URL to external file"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use either file upload or external URL, not both
            </p>
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
              disabled={uploading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Saving...' : (editingItem ? 'Update' : 'Add')} Resource
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  reset();
                  if (fileInputRef.current) fileInputRef.current.value = '';
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
                  {(() => {
                    const itemWithDbFields = item as Resource & { file_url?: string; external_url?: string };
                    const fileUrl = itemWithDbFields.file_url || item.fileUrl;
                    const externalUrl = itemWithDbFields.external_url || item.externalUrl;

                    return (
                      <>
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:text-green-800 inline-flex items-center"
                          >
                            {fileUrl.includes('supabase') ? '📁 Uploaded File' : '📎 File Link'}
                          </a>
                        )}
                        {externalUrl && (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center"
                          >
                            🔗 External Link
                          </a>
                        )}
                      </>
                    );
                  })()}
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