import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase.service';
import { useAuthStore } from './store/auth/auth.slice';
import { AUTH_ROUTES } from './constants/auth';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { setUser, setLoading, isAuthenticated, isLoading } = useAuthStore();
  const { t } = useTranslation();

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path={AUTH_ROUTES.LOGIN} 
          element={isAuthenticated ? <Navigate to={AUTH_ROUTES.HOME} replace /> : <Login />} 
        />
        <Route 
          path={AUTH_ROUTES.HOME} 
          element={isAuthenticated ? <Home /> : <Navigate to={AUTH_ROUTES.LOGIN} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
