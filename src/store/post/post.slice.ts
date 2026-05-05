import { create } from 'zustand';
import type { Post, PostPayload, Comment } from '../../types/post';
import { createPost, fetchPosts, subscribeToPosts, toggleLikePost, deletePost as deletePostService, subscribeToComments, addCommentToPost } from '../../services/post.service';
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

  commentsByPost: Record<string, Comment[]>;
  activeCommentListeners: Record<string, () => void>;
  listenToComments: (postId: string) => void;
  stopListeningToComments: (postId: string) => void;
  submitComment: (postId: string, text: string, user: UserProfile) => Promise<boolean>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  unsubscribePosts: null,
  commentsByPost: {},
  activeCommentListeners: {},

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
  },

  listenToComments: (postId) => {
    const { activeCommentListeners } = get();
    if (activeCommentListeners[postId]) return;

    const unsubscribe = subscribeToComments(postId, (comments) => {
      set((state) => ({
        commentsByPost: { ...state.commentsByPost, [postId]: comments }
      }));
    });

    set((state) => ({
      activeCommentListeners: { ...state.activeCommentListeners, [postId]: unsubscribe }
    }));
  },

  stopListeningToComments: (postId) => {
    const { activeCommentListeners } = get();
    const unsubscribe = activeCommentListeners[postId];
    if (unsubscribe) {
      unsubscribe();
      const newListeners = { ...activeCommentListeners };
      delete newListeners[postId];
      set({ activeCommentListeners: newListeners });
    }
  },

  submitComment: async (postId, text, user) => {
    try {
      await addCommentToPost(postId, text, user);
      return true;
    } catch (error: any) {
      console.error('Lỗi gửi bình luận:', error);
      alert('Không thể gửi bình luận: ' + error.message);
      return false;
    }
  }
}));
