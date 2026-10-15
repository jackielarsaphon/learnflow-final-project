import { useEffect, useState } from 'react';
import { CourseApi } from '../services/CourseApi.js';

const remoteBase = import.meta.env.VITE_API_BASE_URL?.trim();
export const courseApi = new CourseApi({
  baseUrl: remoteBase || (import.meta.env.DEV ? '/api' : './api'),
  staticMode: !remoteBase && !import.meta.env.DEV,
});

export function useCourses() {
  const [state, setState] = useState({ courses: [], categories: [], loading: true, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: '' }));
    Promise.all([courseApi.getCourses(controller.signal), courseApi.getCategories(controller.signal)])
      .then(([courses, categories]) => {
        if (!controller.signal.aborted) setState({ courses, categories, loading: false, error: '' });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState((previous) => ({ ...previous, loading: false, error: error.message || 'เชื่อมต่อ API ไม่สำเร็จ' }));
      });
    return () => controller.abort();
  }, [attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
