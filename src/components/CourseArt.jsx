const art = {
  '1': { label: 'JAVASCRIPT', symbol: 'JS', caption: 'Make your first line count.', shape: 'square' },
  '2': { label: 'REACT.JS', symbol: '⚛', caption: 'Small components. Big ideas.', shape: 'atom' },
  '3': { label: 'NEXT.JS', symbol: 'N', caption: 'Your next step in web.', shape: 'circle' },
  '4': { label: 'UI / UX DESIGN', symbol: 'Aa', caption: 'Design with people in mind.', shape: 'design' },
  '5': { label: 'FIGMA', symbol: 'F', caption: 'From idea to interaction.', shape: 'figma' },
  '6': { label: 'PYTHON', symbol: 'Py', caption: 'Turn data into stories.', shape: 'python' },
  '7': { label: 'MACHINE LEARNING', symbol: 'ML', caption: 'Find patterns. Build possibilities.', shape: 'ml' },
  '8': { label: 'DIGITAL MARKETING', symbol: '↗', caption: 'Make meaningful connections.', shape: 'marketing' },
};
export default function CourseArt({ course, className = '' }) {
  const item = art[course.id] || { label: course.category, symbol: '</>', caption: 'Learn something new.', shape: 'square' };
  return <div className={`course-cover cover-${course.id} ${className}`} aria-hidden="true"><span className="cover-eyebrow">{item.label}</span><span className={`cover-symbol shape-${item.shape}`}>{item.symbol}</span><span className="cover-decoration decor-one" /><span className="cover-decoration decor-two" /><span className="cover-caption">{item.caption}</span><span className="cover-number">0{course.id}</span></div>;
}
