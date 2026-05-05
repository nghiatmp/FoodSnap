import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../store/auth/auth.slice';
import { customColors } from '../../../styles/theme';
import { LogOut, Utensils, Globe, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  const LANGUAGES = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' }
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* === Language Dropdown === */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: isLangOpen ? customColors.background : 'transparent',
              border: `1px solid ${isLangOpen ? customColors.border : 'transparent'}`,
              borderRadius: '8px',
              color: customColors.textSecondary,
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isLangOpen) e.currentTarget.style.backgroundColor = customColors.background;
            }}
            onMouseLeave={(e) => {
              if (!isLangOpen) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Globe size={16} />
            <span style={{ fontSize: '14px' }}>{currentLang.code.toUpperCase()}</span>
            <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {isLangOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: customColors.white,
              border: `1px solid ${customColors.border}`,
              borderRadius: '8px',
              boxShadow: customColors.shadowMedium,
              minWidth: '150px',
              overflow: 'hidden',
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    background: i18n.language === lang.code ? '#ffeaec' : 'transparent',
                    border: 'none',
                    color: i18n.language === lang.code ? customColors.primary : customColors.text,
                    fontWeight: i18n.language === lang.code ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (i18n.language !== lang.code) e.currentTarget.style.backgroundColor = customColors.background;
                  }}
                  onMouseLeave={(e) => {
                    if (i18n.language !== lang.code) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* ======================= */}

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
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = customColors.errorRed;
            e.currentTarget.style.borderColor = customColors.errorRed;
            e.currentTarget.style.backgroundColor = '#ffeaec';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = customColors.textSecondary;
            e.currentTarget.style.borderColor = customColors.border;
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{t('common.logout')}</span>
        </button>
      </div>
    </header>
  );
};
