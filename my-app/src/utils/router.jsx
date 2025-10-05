import React, { useState, useEffect } from 'react';

// Simple Router Context
const RouterContext = React.createContext();

export function Router({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const goBack = () => window.history.back();

  return (
    <RouterContext.Provider value={{ currentPath, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

/**
 * matchPath supports patterns with params, e.g. "/articles/:tag".
 * Returns { params: { tag: 'value' } } or null if no match.
 */
function matchPath(pattern, pathname) {
  // exact match quick path
  if (pattern === pathname) return { params: {} };

  // collect param names
  const paramNames = [];
  // build regex (escape other characters)
  const regexStr = pattern.replace(/([.+?^=!:${}()|[\]\\/])/g, '\\$1') // escape regex chars
                          .replace(/\\:([^/\\]+)/g, (_, name) => {
                            paramNames.push(name);
                            return '([^/]+)';
                          });

  const fullRegex = new RegExp(`^${regexStr}$`);
  const m = pathname.match(fullRegex);
  if (!m) return null;

  const params = {};
  for (let i = 0; i < paramNames.length; i++) {
    params[paramNames[i]] = decodeURIComponent(m[i + 1] || '');
  }
  return { params };
}

export function Route({ path, component: Component }) {
  const { currentPath } = React.useContext(RouterContext);
  const match = matchPath(path, currentPath);

  if (match) {
    // pass parsed params (if any) into the component as a prop
    return <Component params={match.params} />;
  }
  return null;
}

export function useNavigate() {
  const context = React.useContext(RouterContext);
  if (!context) throw new Error('useNavigate must be used within a Router');
  return context.navigate;
}

export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within a Router');
  return context;
}
