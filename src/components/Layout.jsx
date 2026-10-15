import Icon from './Icon.jsx';

export function Header({ page }) {
  const learning = page === 'learning' || page === 'classroom';
  return <header className="site-header">
    <div className="header-inner container">
      <a href="#/" className="brand" aria-label="LearnFlow หน้าหลัก"><span className="brand-icon"><Icon name="book" size={22} /></span><span>learn<span className="brand-flow">flow</span><span className="brand-dot">.</span></span></a>
      <nav className="main-nav" aria-label="เมนูหลัก">
        <a className={!learning ? 'nav-active' : ''} href="#/" aria-current={!learning ? 'page' : undefined}>สำรวจคอร์ส</a>
        <a className={learning ? 'nav-active' : ''} href="#/my-learning" aria-current={learning ? 'page' : undefined}>การเรียนของฉัน</a>
      </nav>
      <a className="header-saved" href="#/my-learning?tab=saved" aria-label="คอร์สที่บันทึกไว้"><Icon name="bookmark" /><span>คอร์สที่บันทึก</span></a>
      <span className="avatar" aria-label="พื้นที่เรียนส่วนตัว">L</span>
    </div>
  </header>;
}
export function Footer() {
  return <footer className="site-footer container"><p><strong>learnflow.</strong><span>เรียนรู้ทีละนิด ไปได้ไกลกว่าที่คิด</span></p><span>React Online Courses · Final Project</span></footer>;
}
export function Breadcrumb({ course, classroom = false }) {
  return <nav className="breadcrumb" aria-label="ตำแหน่งหน้าเว็บ"><a href="#/">คอร์สทั้งหมด</a><Icon name="chevron" size={14} />{classroom ? <><a href={`#/courses/${course.id}`}>{course.name}</a><Icon name="chevron" size={14} /><span>ห้องเรียน</span></> : <span>{course.name}</span>}</nav>;
}
export function EmptyState({ title, description, href = '#/', button = 'สำรวจคอร์ส', icon = 'book' }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={34} /></span><h2>{title}</h2><p>{description}</p><a href={href} className="button button-primary">{button}<Icon name="arrow" size={17} /></a></div>;
}
