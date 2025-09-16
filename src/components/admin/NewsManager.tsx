'use client';
import { useState, useEffect, useRef } from 'react';
import { addNews, getNews, updateDocument, deleteDocument } from '../../lib/db';
import { uploadFile, deleteFile } from '../../lib/storage';
import { useForm } from 'react-hook-form';

interface NewsItem {
  id?: string;
  title: string;
  content: string;
  published: boolean;
  author: string;
  featuredImage?: string;
  createdBy?: string;
  [key: string]: unknown;
}

const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<NewsItem>();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      console.log('Loading news in NewsManager...');
      const newsData = await getNews(false); // Get all news including unpublished
      console.log('News data loaded:', newsData);
      setNews(newsData as NewsItem[]);
    } catch (error) {
      console.error('Error loading news in NewsManager:', error);
      // Set empty array to prevent UI crashes
      setNews([]);
    }
  };

  const onSubmit = async (data: NewsItem) => {
    try {
      setUploading(true);
      console.log('Starting news submission:', data);
      
      let featuredImageUrl = data.featuredImage;
      
      // Handle image upload if a new file is selected
      if (fileInputRef.current?.files?.[0]) {
        console.log('Image file detected, starting upload...');
        const file = fileInputRef.current.files[0];
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        try {
          // Delete old image if updating and had a previous image
          if (editingItem?.featuredImage) {
            try {
              await deleteFile(editingItem.featuredImage);
              console.log('Old image deleted successfully');
            } catch (error) {
              console.warn('Could not delete old image:', error);
            }
          }
          
          featuredImageUrl = await uploadFile(file, fileName);
          console.log('Image uploaded successfully:', featuredImageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert('Image upload failed. Saving news without image. Please enable Firebase Storage first.');
          featuredImageUrl = undefined;
        }
      }
      
      const newsData = {
        title: data.title,
        content: data.content,
        author: data.author,
        published: data.published || false,
        featuredImage: featuredImageUrl || undefined,
        createdBy: 'admin'
      };
      
      console.log('Saving news data:', newsData);
      
      if (editingItem?.id) {
        console.log('Updating existing news item:', editingItem.id);
        await updateDocument('news', editingItem.id, newsData);
      } else {
        console.log('Adding new news item');
        await addNews(newsData);
      }
      
      console.log('News saved successfully');
      
      reset();
      setEditingItem(null);
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadNews();
    } catch (error) {
      console.error('Detailed error saving news:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Error saving news item: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('content', item.content);
    setValue('published', item.published);
    setValue('author', item.author);
    setValue('featuredImage', item.featuredImage || '');
    setPreviewImage(item.featuredImage || null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        // Find the item to get the image URL
        const item = news.find(n => n.id === id);
        if (item?.featuredImage) {
          try {
            await deleteFile(item.featuredImage);
          } catch (error) {
            console.warn('Could not delete image:', error);
          }
        }
        await deleteDocument('news', id);
        loadNews();
      } catch (error) {
        console.error('Error deleting news item:', error);
        alert('Error deleting news item. Please try again.');
      }
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const togglePublished = async (item: NewsItem) => {
    try {
      await updateDocument('news', item.id!, { published: !item.published });
      loadNews();
    } catch (error) {
      console.error('Error updating publish status:', error);
      alert('Error updating publish status. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Edit News Item' : 'Add News Item'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              {...register('title', { required: true })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter news title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              {...register('author', { required: true })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter author name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              {...register('content', { required: true })}
              rows={6}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter news content"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Featured Image <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {previewImage && (
              <div className="mt-2 relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Optional. Supports JPG, PNG, GIF. Maximum size: 5MB
            </p>
          </div>
          
          <div className="flex items-center">
            <input
              {...register('published')}
              type="checkbox"
              className="mr-2"
            />
            <label className="text-sm font-medium">Publish immediately</label>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={uploading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Saving...' : (editingItem ? 'Update' : 'Add')} News
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  reset();
                  setPreviewImage(null);
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

      {/* News List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b">News Items</h2>
        <div className="divide-y">
          {news.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      {item.featuredImage ? (
                        <img
                          src={item.featuredImage}
                          alt="Featured"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">By {item.author}</p>
                      <p className="text-gray-600 mt-2 line-clamp-3">{item.content}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                        <button
                          onClick={() => togglePublished(item)}
                          className={`px-3 py-1 rounded text-xs ${
                            item.published
                              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {item.published ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="text-red-600 hover:text-red-800 px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsManager;