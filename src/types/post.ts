export interface Post {
  id: string;
  authorId: string;
  authorName: string | null;
  authorAvatar: string | null;
  title: string;
  description: string;
  imageUrl: string | null;
  rating: number;
  createdAt: number;
  likes: string[];
}

export interface PostPayload {
  title: string;
  description: string;
  imageFile: File | null;
  rating: number;
}
