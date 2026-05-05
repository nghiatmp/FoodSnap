import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase.service';
import type { PostPayload, Post } from '../types/post';
import type { UserProfile } from '../types/auth';
import { POST_COLLECTION } from '../constants/post';

// Hàm nén ảnh siêu nhẹ và chuyển đổi thành chuỗi văn bản (Base64)
const compressImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Nén thành định dạng JPEG chất lượng 70% để đảm bảo dung lượng file luôn < 1MB
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const createPost = async (payload: PostPayload, user: UserProfile): Promise<void> => {
  let imageUrl = null;

  if (payload.imageFile) {
    // Ép ảnh thành chuỗi Base64 thay vì upload lên Storage
    imageUrl = await compressImageToBase64(payload.imageFile);
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

export const deletePost = async (postId: string): Promise<void> => {
  const postRef = doc(db, POST_COLLECTION, postId);
  await deleteDoc(postRef);
};
