import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import Icon from '../components/Icon.jsx';
import { EmptyState } from '../components/Layout.jsx';
import { useProgress } from '../hooks/useProgress.jsx';

export default function MyLearning({ courses, initialTab }) {
  const { store, mutate } = useProgress();
  const [tab, setTab] = useState(initialTab);
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => setTab(initialTab), [initialTab]);
  const started = courses.filter((course) => store.entry(course.id).lastOpenedAt);
  const completed = started.filter((course) => store.percent(course) === 100);
  const saved = courses.filter((course) => store.entry(course.id).bookmarked);
  const learnedLessons = courses.reduce((total, course) => total + store.completedIds(course).length, 0);
  const filtered = (tab === 'saved' ? saved : tab === 'completed' ? completed : tab === 'active' ? started.filter((course) => store.percent(course) < 100) : started).sort((a, b) => store.entry(b.id).lastOpenedAt - store.entry(a.id).lastOpenedAt);
  return <main className="container my-learning-page" id="main-content"><div className="section-heading"><div><span className="eyebrow">SMALL STEPS, REAL PROGRESS</span><h1>การเรียนของฉัน</h1><p>ทุกบทที่เรียน คืออีกก้าวที่คุณทำได้</p></div><a className="button button-outline" href="#/">สำรวจคอร์สใหม่<Icon name="arrow" size={17} /></a></div><div className="learning-stats"><div><span className="stat-icon"><Icon name="book" /></span><div><strong>{started.length}</strong><span>คอร์สที่เริ่มเรียน</span></div></div><div><span className="stat-icon mint"><Icon name="check" /></span><div><strong>{learnedLessons}</strong><span>บทเรียนที่เรียนจบ</span></div></div><div><span className="stat-icon peach"><Icon name="award" /></span><div><strong>{completed.length}</strong><span>คอร์สที่เรียนครบ</span></div></div><div><span className="stat-icon sky"><Icon name="bookmark" /></span><div><strong>{saved.length}</strong><span>คอร์สที่บันทึก</span></div></div></div><div className="learning-tabs" role="group" aria-label="ประเภทคอร์สของฉัน">{[['all','การเรียนทั้งหมด',started.length],['active','กำลังเรียน',started.length-completed.length],['completed','เรียนครบแล้ว',completed.length],['saved','บันทึกไว้',saved.length]].map(([value,label,count]) => <button aria-pressed={tab === value} className={tab === value ? 'active' : ''} key={value} onClick={() => setTab(value)}>{label}<span>{count}</span></button>)}</div>{filtered.length ? <div className="course-grid">{filtered.map((course) => <CourseCard key={course.id} course={course} showProgress={tab !== 'saved'} />)}</div> : <EmptyState title={tab === 'saved' ? 'ยังไม่มีคอร์สที่บันทึกไว้' : tab === 'completed' ? 'คอร์สแรกที่เรียนครบกำลังรอคุณอยู่' : 'เริ่มต้นการเรียนรู้ของคุณ'} description={tab === 'saved' ? 'กดไอคอนบันทึกบนคอร์สที่สนใจ เพื่อกลับมาเรียนภายหลัง' : 'เลือกคอร์สที่สนใจ เปิดบทแรก แล้วติดตามความก้าวหน้าได้ที่นี่'} icon={tab === 'saved' ? 'bookmark' : 'book'} />}
    <div className="storage-note"><Icon name="check" size={18} /><p>ความคืบหน้า คอร์สที่บันทึก และโน้ต เก็บไว้ในเบราว์เซอร์และอุปกรณ์นี้ การล้างข้อมูลเบราว์เซอร์จะลบข้อมูลการเรียน</p><button className="text-button" onClick={() => setConfirmReset(true)}>ล้างข้อมูลการเรียน</button></div>{confirmReset && <div className="reset-confirmation" role="alert"><p>ล้างความคืบหน้า คอร์สที่บันทึก และโน้ตทั้งหมดในเบราว์เซอร์นี้?</p><button className="button button-danger" onClick={() => { mutate('reset'); setConfirmReset(false); }}>ยืนยันล้างข้อมูล</button><button className="button button-outline" onClick={() => setConfirmReset(false)}>ยกเลิก</button></div>}
  </main>;
}
