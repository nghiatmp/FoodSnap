import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth/auth.slice';
import { customColors } from '../../styles/theme';
import { LogIn } from 'lucide-react';
import './Login.scss';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { loginGoogle, error, isLoading } = useAuthStore();

  const handleGoogleLogin = async () => {
    await loginGoogle();
  };

  return (
    <div className="login-container" style={{ backgroundColor: customColors.background }}>
      <div className="login-card" style={{ backgroundColor: customColors.white, borderColor: customColors.border }}>
        <h1 style={{ color: customColors.primary }}>{t('auth.login.title')}</h1>
        <p style={{ color: customColors.textSecondary }}>{t('auth.login.subtitle')}</p>

        {error && (
          <div className="login-error" style={{ backgroundColor: customColors.errorRed, color: customColors.white }}>
            <strong>{t('auth.login.errorTitle')}</strong>
            <p>{t('auth.login.errorDescription')}</p>
          </div>
        )}

        <button 
          className="google-btn" 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          style={{ 
            backgroundColor: customColors.googleButton, 
            color: customColors.googleText,
            borderColor: customColors.border 
          }}
        >
          <LogIn size={20} />
          <span>{isLoading ? t('common.loading') : t('auth.login.buttonGoogle')}</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
