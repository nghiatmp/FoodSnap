import { create } from 'zustand';
import type { Post, PostPayload } from '../../types/post';
import { createPost, fetchPosts, subscribeToPosts, toggleLikePost, deletePost as deletePostService } from '../../services/post.service';
import type { UserProfile } from '../../types/auth';

interface PostState {
  posts: Post[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  unsubscribePosts: (() => void) | null;
  loadPosts: () => Promise<void>;
  startListeningPosts: () => void;
  stopListeningPosts: () => void;
  submitPost: (payload: PostPayload, user: UserProfile) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  toggleLike: (postId: string, userId: string, isLiked: boolean) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  unsubscribePosts: null,

  loadPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts = await fetchPosts();
      set({ posts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  startListeningPosts: () => {
    set({ isLoading: true, error: null });
    const unsubscribe = subscribeToPosts(
      (posts) => {
        set({ posts, isLoading: false });
      },
      (error) => {
        set({ error: error.message, isLoading: false });
      }
    );
    set({ unsubscribePosts: unsubscribe });
  },

  stopListeningPosts: () => {
    const { unsubscribePosts } = get();
    if (unsubscribePosts) {
      unsubscribePosts();
      set({ unsubscribePosts: null });
    }
  },

  submitPost: async (payload, user) => {
    set({ isSubmitting: true, error: null });
    try {
      await createPost(payload, user);
      // Không cần gọi fetchPosts() nữa vì onSnapshot tự động cập nhật
      set({ isSubmitting: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      return false;
    }
  },

  deletePost: async (postId) => {
    try {
      await deletePostService(postId);
      // Không cần gọi fetchPosts() nữa vì onSnapshot tự động cập nhật
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  toggleLike: async (postId, userId, isLiked) => {
    try {
      // Optimistic Update: Cập nhật giao diện ngay lập tức
      const { posts } = get();
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const likes = post.likes || [];
          return {
            ...post,
            likes: isLiked ? likes.filter(id => id !== userId) : [...likes, userId]
          };
        }
        return post;
      });
      set({ posts: updatedPosts });

      // Gọi API cập nhật lên Server
      await toggleLikePost(postId, userId, isLiked);
    } catch (error: any) {
      console.error('Lỗi thả tim:', error);
      alert('Không thể thả tim: ' + error.message);
      // Phục hồi lại state cũ nếu Server từ chối
      const posts = await fetchPosts();
      set({ posts });
    }
  }
}));
