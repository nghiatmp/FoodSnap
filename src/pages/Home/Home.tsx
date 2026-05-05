import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/organisms/Header';
import { CreatePostForm } from '../../components/organisms/CreatePostForm';
import { usePostStore } from '../../store/post/post.slice';
import { customColors } from '../../styles/theme';
import { Star } from 'lucide-react';
import { RATING_OPTIONS } from '../../constants/post';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { posts, isLoading, loadPosts } = usePostStore();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
        <CreatePostForm />

        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: customColors.text }}>{t('post.feed.title')}</h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: customColors.textSecondary }}>{t('common.loading')}</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: customColors.white, borderRadius: '12px', color: customColors.textSecondary }}>
            {t('post.feed.empty')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {posts.map((post) => (
              <div key={post.id} style={{ 
                backgroundColor: customColors.white, 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: `1px solid ${customColors.border}`
              }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: customColors.border }} />
                  )}
                  <div>
                    <div style={{ fontWeight: '600', color: customColors.text }}>{post.authorName || 'Anonymous'}</div>
                    <div style={{ fontSize: '12px', color: customColors.textSecondary }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                )}

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {RATING_OPTIONS.map((num) => (
                      <Star key={num} size={16} fill={num <= post.rating ? customColors.primary : 'none'} color={num <= post.rating ? customColors.primary : customColors.border} />
                    ))}
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: customColors.text }}>{post.title}</h3>
                  <p style={{ color: customColors.textSecondary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{post.description}</p>
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
