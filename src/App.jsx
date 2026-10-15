import { useEffect } from 'react';
import { Header, Footer, EmptyState } from './components/Layout.jsx';
import Icon from './components/Icon.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Classroom from './pages/Classroom.jsx';
import MyLearning from './pages/MyLearning.jsx';
import { useCourses } from './hooks/useCourses.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useProgress } from './hooks/useProgress.jsx';

export default function App() {
  const route = useHashRoute();
  const { courses, categories, loading, error, retry } = useCourses();
  const { store } = useProgress();
  const course = courses.find((item) => item.id === route.courseId);
  useEffect(() => { document.title = `${course?.name || (route.page === 'learning' ? 'การเรียนของฉัน' : 'เรียนรู้ในจังหวะของคุณ')} | LearnFlow`; }, [course?.name, route.page]);
  let content;
  if (loading) content = <main className="container loading-page" id="main-content" aria-busy="true"><div className="loading-heading skeleton" /><p role="status">กำลังเตรียมคอร์สของคุณ...</p><div className="course-grid">{[1,2,3,4].map((item) => <div className="loading-card skeleton" key={item} />)}</div></main>;
  else if (error) content = <main className="container" id="main-content"><div className="empty-state" role="alert"><span className="empty-icon"><Icon name="refresh" size={30} /></span><h1>เชื่อมต่อข้อมูลไม่สำเร็จ</h1><p>{error}</p><button className="button button-primary" onClick={retry}>ลองโหลดอีกครั้ง</button><p className="error-help">หากรันบนเครื่องของคุณ ให้เปิดโปรเจกต์ด้วยคำสั่ง npm run dev</p></div></main>;
  else if (route.page === 'catalog') content = <Catalog courses={courses} categories={categories} />;
  else if (route.page === 'learning') content = <MyLearning courses={courses} initialTab={route.tab} />;
  else if (course && route.page === 'detail') content = <CourseDetail course={course} />;
  else if (course && route.page === 'classroom') content = <Classroom course={course} requestedLessonId={route.lessonId} />;
  else content = <main className="container" id="main-content"><EmptyState title="ไม่พบหน้าหรือคอร์สนี้" description="กลับไปเลือกคอร์สที่คุณสนใจจากหน้าหลัก" /></main>;
  return <><a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); const main = document.getElementById('main-content'); main?.setAttribute('tabindex','-1'); main?.focus(); }}>ข้ามไปเนื้อหาหลัก</a><Header page={route.page} />{store.error && <div className="storage-warning" role="alert">{store.error}</div>}{content}<Footer /></>;
}
