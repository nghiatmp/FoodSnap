import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase.service';
import type { PostPayload, Post } from '../types/post';
import type { UserProfile } from '../types/auth';
import { POST_COLLECTION } from '../constants/post';

export const createPost = async (payload: PostPayload, user: UserProfile): Promise<void> => {
  let imageUrl = null;

  if (payload.imageFile) {
    const fileExtension = payload.imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${user.uid}.${fileExtension}`;
    const storageRef = ref(storage, `postImages/${fileName}`);
    
    await uploadBytes(storageRef, payload.imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }

  const postsRef = collection(db, POST_COLLECTION);
  await addDoc(postsRef, {
    authorId: user.uid,
    authorName: user.displayName,
    authorAvatar: user.photoURL,
    title: payload.title,
    description: payload.description,
    rating: payload.rating,
    imageUrl: imageUrl,
    createdAt: Date.now(),
  });
};

export const fetchPosts = async (): Promise<Post[]> => {
  const postsRef = collection(db, POST_COLLECTION);
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
};
