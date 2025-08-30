'use client';
import { useState, useEffect } from 'react';
import { addNews, getNews, updateDocument, deleteDocument } from '../../lib/db';
import { useForm } from 'react-hook-form';

interface NewsItem {
  id?: string;
  title: string;
  content: string;
  published: boolean;
  featuredImage?: string;
  [key: string]: unknown;
}

const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<NewsItem>();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const newsData = await getNews(false); // Get all news including unpublished
    setNews(newsData as NewsItem[]);
  };

  const onSubmit = async (data: NewsItem) => {
    try {
      if (editingItem?.id) {
        await updateDocument('news', editingItem.id, data);
      } else {
        await addNews(data);
      }
      reset();
      setEditingItem(null);
      loadNews();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('content', item.content);
    setValue('published', item.published);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      await deleteDocument('news', id);
      loadNews();
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
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              {...register('content', { required: true })}
              rows={6}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter news content"
            />
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
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {editingItem ? 'Update' : 'Add'} News
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

      {/* News List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b">News Items</h2>
        <div className="divide-y">
          {news.map((item) => (
            <div key={item.id} className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                  item.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.published ? 'Published' : 'Draft'}
                </span>
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

export default NewsManager;