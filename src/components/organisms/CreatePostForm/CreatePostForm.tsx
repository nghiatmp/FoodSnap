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
  const [hoverRating, setHoverRating] = useState<number | null>(null);

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
      backgroundColor: customColors.surface,
      padding: '32px',
      borderRadius: '24px',
      boxShadow: customColors.shadowLight,
      marginBottom: '32px',
      border: `1px solid ${customColors.border}`
    }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: customColors.text }}>
        {t('post.create.title')}
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder={t('post.create.inputTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '12px', 
            border: `1px solid ${customColors.border}`, 
            backgroundColor: '#fbfbfb',
            fontSize: '16px',
            color: customColors.text,
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = customColors.primary}
          onBlur={(e) => e.target.style.borderColor = customColors.border}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <textarea 
          placeholder={t('post.create.inputDescription')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '12px', 
            border: `1px solid ${customColors.border}`, 
            backgroundColor: '#fbfbfb',
            fontSize: '16px', 
            color: customColors.text,
            resize: 'vertical',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = customColors.primary}
          onBlur={(e) => e.target.style.borderColor = customColors.border}
        />
      </div>

      <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: customColors.textSecondary, display: 'block', marginBottom: '12px' }}>
            {t('post.create.rating')}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {RATING_OPTIONS.map((num) => (
              <button 
                key={num}
                type="button"
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: num <= (hoverRating || rating) ? customColors.primary : '#e1e1e1',
                  transition: 'transform 0.1s ease',
                  transform: num <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <Star fill={num <= (hoverRating || rating) ? customColors.primary : 'none'} size={28} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: customColors.textSecondary, display: 'block', marginBottom: '12px' }}>
            {t('post.create.uploadImage')}
          </span>
          <label style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px', 
            padding: '10px 20px', 
            borderRadius: '12px', 
            border: `2px dashed ${customColors.primary}`,
            backgroundColor: 'rgba(255, 71, 87, 0.05)',
            color: customColors.primary,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 71, 87, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 71, 87, 0.05)'}
          >
            <ImagePlus size={20} />
            {t('post.create.uploadImage')}
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {previewUrl && (
        <div style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${customColors.border}` }}>
          <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: customColors.primary,
          color: customColors.white,
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: isSubmitting || !title.trim() ? 'not-allowed' : 'pointer',
          opacity: isSubmitting || !title.trim() ? 0.6 : 1,
          boxShadow: `0 4px 14px ${customColors.primary}40`,
          transition: 'all 0.2s ease',
          transform: isSubmitting || !title.trim() ? 'none' : 'translateY(0)'
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting && title.trim()) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${customColors.primary}60`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting && title.trim()) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 14px ${customColors.primary}40`;
          }
        }}
      >
        {isSubmitting ? t('common.loading') : t('post.create.submit')}
      </button>
    </form>
  );
};
