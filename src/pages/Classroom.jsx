import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { Breadcrumb } from '../components/Layout.jsx';
import { useProgress } from '../hooks/useProgress.jsx';
import { classroomHref } from '../hooks/useHashRoute.js';

export default function Classroom({ course, requestedLessonId }) {
  const { store, mutate } = useProgress();
  const lesson = course.getLecture(requestedLessonId) || course.getLecture(store.nextLessonId(course));
  const [videoError, setVideoError] = useState(false);
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  useEffect(() => {
    if (!lesson) return;
    setVideoError(false);
    setMessage('');
    setNote(store.entry(course.id).notes[lesson.id] || '');
    mutate('visit', course, lesson.id);
  }, [course.id, lesson?.id, mutate]);
  if (!lesson) return <main className="container"><p>คอร์สนี้ยังไม่มีบทเรียน</p></main>;
  const index = course.lectures.findIndex((item) => item.id === lesson.id);
  const completed = store.isCompleted(course, lesson.id);
  const percent = store.percent(course);
  const previous = course.lectures[index - 1];
  const next = course.lectures[index + 1];
  function toggleCompleted() {
    mutate('setCompleted', course, lesson.id, !completed);
    setMessage(completed ? 'เปลี่ยนบทนี้เป็นยังไม่เรียนแล้ว' : 'บันทึกว่าเรียนจบแล้ว เก่งมาก!');
  }
  return <main className="container classroom-page" id="main-content"><Breadcrumb course={course} classroom /><div className="classroom-heading"><div><span className="eyebrow">YOUR CLASSROOM</span><h1>{course.name}</h1></div><a href={`#/courses/${course.id}`} className="text-link"><Icon name="back" size={16} />รายละเอียดคอร์ส</a></div>
    <div className="classroom-layout"><section className="classroom-main"><div className="video-shell"><video key={lesson.id} src={lesson.videoUrl} poster={lesson.posterUrl} controls playsInline preload="metadata" aria-label={`วิดีโอ ${lesson.title}`} onError={() => setVideoError(true)} onEnded={() => { mutate('setCompleted', course, lesson.id, true); setMessage('วิดีโอจบแล้ว บันทึกความคืบหน้าเรียบร้อย'); }} />{videoError && <div className="video-error" role="alert"><Icon name="refresh" size={30} /><h3>โหลดวิดีโอไม่สำเร็จ</h3><p>ตรวจสอบการเชื่อมต่อแล้วเปิดบทเรียนอีกครั้ง</p><button className="button button-primary" onClick={() => { setVideoError(false); document.querySelector('video')?.load(); }}>ลองอีกครั้ง</button></div>}</div><div className="video-caption"><Icon name="play" size={14} />{lesson.videoLabel}<span>เวลาหลักสูตร: {lesson.duration}</span></div>
      <div className="lesson-heading"><div><span className="eyebrow">บทเรียน {String(index + 1).padStart(2, '0')} / {String(course.lectureCount).padStart(2, '0')}</span><h2>{lesson.title}</h2></div><button className={`button ${completed ? 'button-completed' : 'button-primary'}`} aria-pressed={completed} onClick={toggleCompleted}><Icon name="check" size={18} />{completed ? 'เรียนจบแล้ว' : 'ทำเครื่องหมายว่าเรียนจบ'}</button></div><p className="action-message" role="status">{message || 'เมื่อดูวิดีโอจบ ระบบจะบันทึกบทนี้ให้โดยอัตโนมัติ หรือกดทำเครื่องหมายเองได้'}</p>
      <nav className="lesson-navigation" aria-label="เปลี่ยนบทเรียน">{previous ? <a href={classroomHref(course.id, previous.id)}><Icon name="back" size={18} /><div><span>บทก่อนหน้า</span><strong>{previous.title}</strong></div></a> : <span />}{next ? <a href={classroomHref(course.id, next.id)} className="next-lesson"><div><span>บทถัดไป</span><strong>{next.title}</strong></div><Icon name="arrow" size={18} /></a> : <a href="#/my-learning" className="next-lesson"><div><span>กลับไปดูความก้าวหน้า</span><strong>การเรียนของฉัน</strong></div><Icon name="arrow" size={18} /></a>}</nav>
      <section className="notes-panel"><div className="panel-title"><h3><Icon name="note" size={19} />โน้ตประจำบทเรียน</h3><span>{note.length}/5000</span></div><label htmlFor="lesson-note" className="sr-only">โน้ตของ {lesson.title}</label><textarea id="lesson-note" value={note} maxLength={5000} placeholder="จดแนวคิดสำคัญ หรือสิ่งที่อยากลองทำ..." onChange={(event) => { setNote(event.target.value); mutate('setNote', course, lesson.id, event.target.value); }} /><p>โน้ตบันทึกอัตโนมัติในเบราว์เซอร์นี้</p></section>
    </section><aside className="classroom-sidebar"><div className="sidebar-heading"><h2>เนื้อหาในคอร์ส</h2><div className="progress-label"><span>เรียนแล้ว {store.completedIds(course).length}/{course.lectureCount} บท</span><strong>{percent}%</strong></div><ProgressBar value={percent} /></div><ol className="sidebar-lessons">{course.lectures.map((item, itemIndex) => <li key={item.id}><a className={item.id === lesson.id ? 'active' : ''} href={classroomHref(course.id, item.id)} aria-current={item.id === lesson.id ? 'step' : undefined}><span className={`sidebar-check ${store.isCompleted(course, item.id) ? 'checked' : ''}`}>{store.isCompleted(course, item.id) ? <Icon name="check" size={15} /> : itemIndex + 1}</span><div><strong>{item.title}</strong><span>{item.duration}{store.isCompleted(course, item.id) ? ' · เรียนจบแล้ว' : ''}</span></div>{item.id === lesson.id && <Icon name="play" size={15} />}</a></li>)}</ol><div className="sidebar-hint"><Icon name="spark" size={20} /><p>{percent === 100 ? 'คุณเรียนครบทุกบทแล้ว กลับมาทบทวนได้ทุกเมื่อ' : 'ก้าวเล็ก ๆ ในวันนี้ คือทักษะใหม่ในวันพรุ่งนี้'}</p></div></aside></div>
  </main>;
}
