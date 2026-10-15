import CourseArt from './CourseArt.jsx';
import Icon from './Icon.jsx';
import ProgressBar from './ProgressBar.jsx';
import { useProgress } from '../hooks/useProgress.jsx';
import { classroomHref } from '../hooks/useHashRoute.js';

export default function CourseCard({ course, showProgress = false }) {
  const { store, mutate } = useProgress();
  const entry = store.entry(course.id);
  const percent = store.percent(course);
  return <article className="course-card">
    <div className="card-art"><a href={`#/courses/${course.id}`} aria-label={`ดูรายละเอียด ${course.name}`}><CourseArt course={course} /></a><button type="button" className={`save-button ${entry.bookmarked ? 'is-saved' : ''}`} aria-label={`${entry.bookmarked ? 'เลิกบันทึก' : 'บันทึก'} ${course.name}`} aria-pressed={entry.bookmarked} onClick={() => mutate('toggleBookmark', course.id)}><Icon name="bookmark" size={18} /></button></div>
    <div className="card-content"><div className="card-category-row"><span className={`category-label category-${course.category.replace(/\s+/g, '-').toLowerCase()}`}>{course.category}</span>{percent === 100 && <span className="completed-badge"><Icon name="check" size={12} />เรียนครบ</span>}</div><h3><a href={`#/courses/${course.id}`}>{course.name}</a></h3><p className="card-description">{course.description}</p>
      <div className="course-meta"><span><Icon name="book" size={15} />{course.lectureCount} บทเรียน</span><span><Icon name="clock" size={15} />{course.durationLabel}</span></div>
      {showProgress || percent > 0 ? <div className="card-progress"><div><span>เรียนแล้ว {store.completedIds(course).length}/{course.lectureCount} บท</span><strong>{percent}%</strong></div><ProgressBar value={percent} /></div> : null}
      <div className="card-bottom"><span>{entry.lastOpenedAt ? 'ไปต่อในจังหวะของคุณ' : 'พร้อมเริ่มเรียน'}</span><a href={showProgress ? classroomHref(course.id, store.nextLessonId(course)) : `#/courses/${course.id}`} className="card-link">{showProgress ? (percent === 100 ? 'ทบทวน' : 'เรียนต่อ') : 'ดูคอร์ส'}<Icon name="arrow" size={16} /></a></div>
    </div>
  </article>;
}
