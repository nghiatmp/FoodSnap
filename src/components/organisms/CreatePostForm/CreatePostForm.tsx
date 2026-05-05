import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePostStore } from '../../../store/post/post.slice';
import { useAuthStore } from '../../../store/auth/auth.slice';
import { customColors } from '../../../styles/theme';
import { ImagePlus, Star } from 'lucide-react';
import { RATING_OPTIONS } from '../../../constants/post';

export const CreatePostForm: React.FC = () => {
  const { t } = useTranslation();
  const { submitPost, isSubmitting } = usePostStore();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    const success = await submitPost({ title, description, rating, imageFile }, user);
    if (success) {
      setTitle('');
      setDescription('');
      setRating(5);
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: customColors.white,
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      marginBottom: '24px',
      border: `1px solid ${customColors.border}`
    }}>
      <h2 style={{ fontSize: '18px', marginBottom: '16px', color: customColors.text }}>{t('post.create.title')}</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <input 
          type="text" 
          placeholder={t('post.create.inputTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${customColors.border}`, fontSize: '16px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <textarea 
          placeholder={t('post.create.inputDescription')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${customColors.border}`, fontSize: '16px', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '14px', color: customColors.textSecondary, display: 'block', marginBottom: '8px' }}>{t('post.create.rating')}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {RATING_OPTIONS.map((num) => (
              <button 
                key={num}
                type="button"
                onClick={() => setRating(num)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: num <= rating ? customColors.primary : customColors.border 
                }}
              >
                <Star fill={num <= rating ? customColors.primary : 'none'} size={24} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '14px', color: customColors.textSecondary, display: 'block', marginBottom: '8px' }}>{t('post.create.uploadImage')}</span>
          <label style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            border: `1px dashed ${customColors.primary}`,
            color: customColors.primary,
            cursor: 'pointer'
          }}>
            <ImagePlus size={20} />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {previewUrl && (
        <div style={{ marginBottom: '16px' }}>
          <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: customColors.primary,
          color: customColors.white,
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isSubmitting || !title.trim() ? 'not-allowed' : 'pointer',
          opacity: isSubmitting || !title.trim() ? 0.6 : 1
        }}
      >
        {isSubmitting ? t('common.loading') : t('post.create.submit')}
      </button>
    </form>
  );
};
