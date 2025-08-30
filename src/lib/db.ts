import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// News Operations
export const addNews = async (newsData: Record<string, unknown>) => {
  return await addDoc(collection(db, 'news'), {
    ...newsData,
    date: Timestamp.now(),
    published: newsData.published || false
  });
};

export const getNews = async (published: boolean = true) => {
  let q;
  if (published) {
    q = query(
      collection(db, 'news'),
      where('published', '==', published),
      orderBy('date', 'desc')
    );
  } else {
    q = query(collection(db, 'news'), orderBy('date', 'desc'));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Resources Operations
export const addResource = async (resourceData: Record<string, unknown>) => {
  return await addDoc(collection(db, 'resources'), {
    ...resourceData,
    date: Timestamp.now()
  });
};

export const getResources = async () => {
  const q = query(collection(db, 'resources'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Collaborators Operations
export const addCollaborator = async (collaboratorData: Record<string, unknown>) => {
  return await addDoc(collection(db, 'collaborators'), collaboratorData);
};

export const getCollaborators = async () => {
  const querySnapshot = await getDocs(collection(db, 'collaborators'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Generic update and delete functions
export const updateDocument = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};