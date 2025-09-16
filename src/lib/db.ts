import { supabase, News, Resource, Collaborator } from './supabase';

// News Operations
export const addNews = async (newsData: Record<string, unknown>) => {
  try {
    console.log('Adding news to Supabase:', newsData);
    
    const docData = {
      title: newsData.title as string,
      content: newsData.content as string,
      date: new Date().toISOString(),
      published: newsData.published || false,
      author: newsData.author || 'Unknown',
      created_by: newsData.createdBy || 'admin',
      featured_image: newsData.featuredImage as string || null
    };
    
    console.log('Document data to save:', docData);
    
    const { data, error } = await supabase
      .from('news')
      .insert([docData])
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('News added successfully with ID:', data.id);
    return { id: data.id };
  } catch (error) {
    console.error('Error in addNews:', {
      error,
      message: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getNews = async (published: boolean = true) => {
  try {
    console.log('Getting news from Supabase, published filter:', published);
    
    let query = supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });
    
    if (published) {
      query = query.eq('published', true);
    }
    
    console.log('Executing Supabase query...');
    const { data, error } = await query;
    
    if (error) throw error;
    
    console.log('Query successful, documents found:', data?.length || 0);
    console.log('News data retrieved:', data);
    
    return data || [];
  } catch (error) {
    console.error('Error in getNews:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      published
    });
    
    // Return empty array instead of throwing to prevent page crashes
    console.warn('Returning empty array due to Supabase error');
    return [];
  }
};

// Resources Operations
export const addResource = async (resourceData: Record<string, unknown>) => {
  const docData = {
    title: resourceData.title as string,
    description: resourceData.description as string,
    category: resourceData.category as string,
    file_url: resourceData.fileUrl as string || null,
    external_url: resourceData.externalUrl as string || null,
    date: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('resources')
    .insert([docData])
    .select()
    .single();

  if (error) throw error;
  return { id: data.id };
};

export const getResources = async () => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Collaborators Operations
export const addCollaborator = async (collaboratorData: Record<string, unknown>) => {
  const docData = {
    name: collaboratorData.name as string,
    description: collaboratorData.description as string,
    logo_url: collaboratorData.logoUrl as string || null,
    website_url: collaboratorData.websiteUrl as string || null,
    featured: collaboratorData.featured as boolean || false
  };

  const { data, error } = await supabase
    .from('collaborators')
    .insert([docData])
    .select()
    .single();

  if (error) throw error;
  return { id: data.id };
};

export const getCollaborators = async () => {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Generic update and delete functions
export const updateDocument = async (collectionName: string, id: string, updateData: Record<string, unknown>) => {
  const { error } = await supabase
    .from(collectionName)
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const { error } = await supabase
    .from(collectionName)
    .delete()
    .eq('id', id);

  if (error) throw error;
};
