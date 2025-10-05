import React, { useState, useEffect } from 'react';

// Simple Router Context
const RouterContext = React.createContext();

export function Router({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Route({ path, component: Component }) {
  const { currentPath } = React.useContext(RouterContext);
  
  // Exact match for paths
  if (currentPath === path) {
    return <Component />;
  }
  
  return null;
}

export function useNavigate() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error('useNavigate must be used within a Router');
  }
  return context.navigate;
}

export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
}