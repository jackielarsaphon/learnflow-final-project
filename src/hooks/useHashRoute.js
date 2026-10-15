import { useEffect, useState } from 'react';

export function parseRoute(hash) {
  const [path, query = ''] = (hash.replace(/^#/, '') || '/').split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  if (parts.length === 0) return { page: 'catalog' };
  if (parts.length === 1 && parts[0] === 'my-learning') return { page: 'learning', tab: params.get('tab') || 'all' };
  if (parts[0] === 'courses' && parts.length === 2) return { page: 'detail', courseId: decodeURIComponent(parts[1]) };
  if (parts[0] === 'learn' && parts.length === 2) return { page: 'classroom', courseId: decodeURIComponent(parts[1]), lessonId: params.get('lesson') };
  return { page: 'not-found' };
}
export function useHashRoute() {
  const safeParse = () => { try { return parseRoute(window.location.hash); } catch { return { page: 'not-found' }; } };
  const [route, setRoute] = useState(safeParse);
  useEffect(() => {
    const listener = () => { setRoute(safeParse()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);
  return route;
}
export const classroomHref = (courseId, lessonId) => `#/learn/${encodeURIComponent(courseId)}${lessonId ? `?lesson=${encodeURIComponent(lessonId)}` : ''}`;
