import React, { useState, useEffect } from 'react';
import { usePostStore } from '../../../store/post/post.slice';
import { useAuthStore } from '../../../store/auth/auth.slice';
import { customColors } from '../../../styles/theme';
import { Send } from 'lucide-react';

interface Props {
  postId: string;
}

export const CommentSection: React.FC<Props> = ({ postId }) => {
  const { commentsByPost, listenToComments, stopListeningToComments, submitComment } = usePostStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    listenToComments(postId);
    return () => {
      stopListeningToComments(postId);
    };
  }, [postId, listenToComments, stopListeningToComments]);

  const comments = commentsByPost[postId] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    setIsSubmitting(true);
    const success = await submitComment(postId, text, user);
    if (success) {
      setText('');
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ marginTop: '16px', borderTop: `1px solid ${customColors.border}`, paddingTop: '16px' }}>
      <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '16px', paddingRight: '8px' }}>
        {comments.map((cmt) => (
          <div key={cmt.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            {cmt.authorAvatar ? (
              <img 
                src={cmt.authorAvatar} 
                alt="Avatar" 
                referrerPolicy="no-referrer" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: customColors.border, flexShrink: 0 }} />
            )}
            <div style={{ backgroundColor: customColors.background, padding: '10px 14px', borderRadius: '12px', flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: customColors.text, marginBottom: '4px' }}>
                {cmt.authorName || 'Anonymous'}
              </div>
              <div style={{ fontSize: '14px', color: customColors.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {cmt.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Thêm bình luận..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '20px',
            border: `1px solid ${customColors.border}`,
            outline: 'none',
            fontSize: '14px',
            backgroundColor: customColors.background
          }}
        />
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          style={{
            backgroundColor: text.trim() ? customColors.primary : customColors.border,
            color: customColors.white,
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: text.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
        >
          <Send size={18} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
    </div>
  );
};
