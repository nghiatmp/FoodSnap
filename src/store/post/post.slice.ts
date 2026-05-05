import { create } from 'zustand';
import type { Post, PostPayload } from '../../types/post';
import { createPost, fetchPosts } from '../../services/post.service';
import type { UserProfile } from '../../types/auth';

interface PostState {
  posts: Post[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadPosts: () => Promise<void>;
  submitPost: (payload: PostPayload, user: UserProfile) => Promise<boolean>;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts = await fetchPosts();
      set({ posts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitPost: async (payload, user) => {
    set({ isSubmitting: true, error: null });
    try {
      await createPost(payload, user);
      // Re-fetch posts after successful creation
      const posts = await fetchPosts();
      set({ posts, isSubmitting: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      return false;
    }
  }
}));
