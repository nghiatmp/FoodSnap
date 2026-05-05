import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/organisms/Header';
import { CreatePostForm } from '../../components/organisms/CreatePostForm';
import { usePostStore } from '../../store/post/post.slice';
import { useAuthStore } from '../../store/auth/auth.slice';
import { customColors } from '../../styles/theme';
import { Star, Trash2 } from 'lucide-react';
import { RATING_OPTIONS } from '../../constants/post';
import { LoadingSpinner } from '../../components/atoms/LoadingSpinner/LoadingSpinner';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { posts, isLoading, error, loadPosts, deletePost } = usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async (postId: string) => {
    if (window.confirm(t('post.feed.deleteConfirm'))) {
      await deletePost(postId);
    }
  };

  return (
    <div style={{ backgroundColor: customColors.background, minHeight: '100vh', paddingBottom: '60px' }}>
      <Header />
      
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px' }}>
        <CreatePostForm />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: customColors.text }}>{t('post.feed.title')}</h2>
        </div>
        
        {isLoading ? (
          <div style={{ padding: '60px 0' }}>
            <LoadingSpinner text={t('common.loading')} />
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            backgroundColor: '#ffeaec', 
            borderRadius: '24px', 
            color: customColors.errorRed,
            border: `1px solid ${customColors.errorRed}`
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Database Connection Error</div>
            <div style={{ fontSize: '15px' }}>{error}</div>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: customColors.surface, 
            borderRadius: '24px', 
            color: customColors.textSecondary,
            border: `1px solid ${customColors.border}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
            <div style={{ fontSize: '18px', fontWeight: '500' }}>{t('post.feed.empty')}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {posts.map((post) => (
              <div key={post.id} style={{ 
                backgroundColor: customColors.surface, 
                borderRadius: '24px', 
                overflow: 'hidden',
                boxShadow: customColors.shadowLight,
                border: `1px solid ${customColors.border}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = customColors.shadowMedium;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = customColors.shadowLight;
              }}
              >
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {post.authorAvatar ? (
                      <img 
                        src={post.authorAvatar} 
                        alt="Avatar" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Nếu ảnh lỗi (ví dụ Google đổi link), thay bằng cái vòng tròn xám
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyNCIgZmlsbD0iI2UxZTFlMSIvPjwvc3ZnPg==';
                        }}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: customColors.border }} />
                    )}
                    <div>
                      <div style={{ fontWeight: '700', color: customColors.text, fontSize: '16px' }}>{post.authorName || 'Anonymous'}</div>
                      <div style={{ fontSize: '13px', color: customColors.textSecondary, marginTop: '2px' }}>
                        {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                  {user?.uid === post.authorId && (
                    <button 
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: customColors.textSecondary,
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = customColors.errorRed;
                        e.currentTarget.style.backgroundColor = '#ffeaec';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = customColors.textSecondary;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                )}

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                    {RATING_OPTIONS.map((num) => (
                      <Star key={num} size={20} fill={num <= post.rating ? customColors.primary : 'none'} color={num <= post.rating ? customColors.primary : '#e1e1e1'} />
                    ))}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: customColors.text }}>{post.title}</h3>
                  <p style={{ color: customColors.textSecondary, fontSize: '16px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
