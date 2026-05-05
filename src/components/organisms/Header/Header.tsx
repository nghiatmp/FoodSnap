import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../store/auth/auth.slice';
import { customColors } from '../../../styles/theme';
import { LogOut, Utensils } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 24px', 
      backgroundColor: customColors.white,
      borderBottom: `1px solid ${customColors.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: customColors.primary, fontWeight: 'bold', fontSize: '20px' }}>
        <Utensils />
        FoodSnap
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user?.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'Avatar'} 
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <span style={{ color: customColors.text, fontWeight: '500' }}>{user?.displayName}</span>
        
        <button 
          onClick={logout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${customColors.border}`,
            borderRadius: '6px',
            color: customColors.textSecondary,
            cursor: 'pointer'
          }}
        >
          <LogOut size={16} />
          {t('common.logout')}
        </button>
      </div>
    </header>
  );
};
