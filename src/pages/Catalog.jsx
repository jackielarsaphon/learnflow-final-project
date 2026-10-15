import { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import Icon from '../components/Icon.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { useProgress } from '../hooks/useProgress.jsx';
import { classroomHref } from '../hooks/useHashRoute.js';

const categoryIcons = { Programming: 'code', Design: 'pen', 'Data Science': 'chart', Marketing: 'spark' };
export default function Catalog({ courses, categories }) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recommended');
  const { store } = useProgress();
  const visible = useMemo(() => {
    const matches = courses.filter((course) => (category === 'all' || course.category === category) && course.matches(query));
    if (sort === 'shortest') return matches.sort((a, b) => a.totalMinutes - b.totalMinutes);
    if (sort === 'name') return matches.sort((a, b) => a.name.localeCompare(b.name));
    return matches;
  }, [courses, category, query, sort]);
  const recent = [...courses].filter((course) => store.entry(course.id).lastOpenedAt).sort((a, b) => store.entry(b.id).lastOpenedAt - store.entry(a.id).lastOpenedAt)[0];
  const totalLessons = courses.reduce((total, course) => total + course.lectureCount, 0);
  return <main className="container catalog-page" id="main-content">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><span className="tiny-dot" /> A LITTLE LEARNING, EVERY DAY</span><h1>ทักษะใหม่เริ่มได้<br />ใน<span className="hero-highlight">จังหวะของคุณ<svg viewBox="0 0 330 14"><path d="M3 10Q165-4 327 8" /></svg></span></h1><p>เลือกสิ่งที่อยากเรียน ลงมือทีละบท<br className="desktop-break" />แล้วเติบโตไปกับทุกความก้าวหน้าเล็ก ๆ</p><a href="#course-catalog" onClick={(event) => { event.preventDefault(); document.getElementById('course-catalog')?.scrollIntoView({ behavior: 'smooth' }); }} className="button button-primary">ค้นหาคอร์สที่ใช่<Icon name="arrow" size={19} /></a><div className="hero-caption"><Icon name="check" size={15} /> เรียนได้ทุกที่ · บันทึกความคืบหน้าอัตโนมัติ</div></div>
      <div className="hero-art" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span className="hero-plus plus-one">+</span><span className="hero-plus plus-two">+</span><div className="code-window"><div className="window-toolbar"><div><i /><i /><i /></div><span>your-next-skill.js</span></div><div className="code-content"><span className="line-number">01</span><code><span>const</span> future = {'{'}</code><span className="line-number">02</span><code>&nbsp; curiosity: <b>true</b>,</code><span className="line-number">03</span><code>&nbsp; practice: <b>'every day'</b>,</code><span className="line-number">04</span><code>&nbsp; possibilities: <b>Infinity</b></code><span className="line-number">05</span><code>{'}'};</code><span className="line-number">06</span><code className="code-comment">// start with one lesson.</code></div><div className="window-footer"><span className="tiny-dot" /> Ready to learn</div></div><div className="floating-card skill-card"><span className="float-icon"><Icon name="code" size={23} /></span><div><strong>Build your next skill</strong><span>ก้าวเล็ก ๆ ที่สร้างโอกาสใหม่</span></div></div><div className="floating-card lesson-card"><span className="float-icon mint"><Icon name="play" size={21} /></span><div><strong>{totalLessons} บทเรียน</strong><span>เริ่มได้จากสิ่งที่สนใจ</span></div><Icon name="spark" size={18} /></div></div>
    </section>
    <div className="catalog-stat-strip"><div><Icon name="book" /><strong>{courses.length}</strong><span>คอร์สพร้อมเรียน</span></div><div><Icon name="grid" /><strong>{categories.length}</strong><span>หมวดหมู่ทักษะ</span></div><div><Icon name="play" /><strong>{totalLessons}</strong><span>บทเรียนให้ค้นพบ</span></div><p>เรียนในแบบของคุณ<span>ทุกความก้าวหน้ามีความหมาย</span></p></div>
    {recent && <section className="resume-banner"><div className="resume-icon"><Icon name="play" size={22} /></div><div className="resume-copy"><span>กลับมาเรียนต่อกัน</span><h2>{recent.name}</h2></div><div className="resume-progress"><span>ความคืบหน้า {store.percent(recent)}%</span><ProgressBar value={store.percent(recent)} /></div><a className="button button-primary" href={classroomHref(recent.id, store.nextLessonId(recent))}>เรียนต่อ<Icon name="arrow" size={17} /></a></section>}
    <section className="catalog-section" id="course-catalog"><div className="section-heading"><div><span className="eyebrow">EXPLORE YOUR POSSIBILITIES</span><h2>คอร์สที่ใช่ สำหรับก้าวต่อไป</h2><p>ค้นพบเรื่องที่สนใจ และเริ่มเรียนได้เลย</p></div><span className="section-count">{courses.length} คอร์สทั้งหมด</span></div>
      <div className="catalog-toolbar"><div className="category-tabs" role="group" aria-label="กรองตามหมวดหมู่">{['all', ...categories].map((item) => <button className={`category-tab ${category === item ? 'active' : ''}`} aria-pressed={category === item} key={item} onClick={() => setCategory(item)}><Icon name={categoryIcons[item] || 'grid'} size={16} />{item === 'all' ? 'ทั้งหมด' : item}<span>{item === 'all' ? courses.length : courses.filter((course) => course.category === item).length}</span></button>)}</div><div className="catalog-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" aria-label="ค้นหาคอร์ส" placeholder="ค้นหาคอร์สที่สนใจ..." /></div></div>
      <div className="result-toolbar"><p aria-live="polite">แสดง <strong>{visible.length}</strong> คอร์ส{category !== 'all' && ` ใน ${category}`}{query && ` สำหรับ “${query}”`}</p><label>เรียงตาม<select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="เรียงลำดับคอร์ส"><option value="recommended">ลำดับคอร์ส</option><option value="shortest">เวลาเรียนน้อยที่สุด</option><option value="name">ชื่อคอร์ส A–Z</option></select></label></div>
      {visible.length ? <div className="course-grid">{visible.map((course) => <CourseCard key={course.id} course={course} />)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name="search" size={30} /></span><h3>ยังไม่พบคอร์สที่ค้นหา</h3><p>ลองคำค้นอื่น หรือเลือกดูทุกหมวดหมู่</p><button className="button button-primary" onClick={() => { setQuery(''); setCategory('all'); }}>ล้างตัวกรอง</button></div>}
    </section>
    <section className="bottom-note"><span className="note-icon"><Icon name="spark" size={27} /></span><div><h3>ไม่ต้องรู้ทุกอย่างก่อนเริ่ม</h3><p>แค่เริ่มจากบทแรก แล้วค่อย ๆ เรียนรู้ไปด้วยกัน</p></div><a href="#/my-learning">ดูการเรียนของฉัน<Icon name="arrow" size={17} /></a></section>
  </main>;
}
