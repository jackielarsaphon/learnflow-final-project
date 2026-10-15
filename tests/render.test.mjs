import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

test('React pages render real course data, lesson media and stored progress', async () => {
  // Vite's middleware mode transpiles JSX without starting a preview server.
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  const values = new Map();
  globalThis.window = { localStorage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } };
  try {
    const { Course } = await vite.ssrLoadModule('/src/models/Course.js');
    const { ProgressProvider } = await vite.ssrLoadModule('/src/hooks/useProgress.jsx');
    const { parseRoute } = await vite.ssrLoadModule('/src/hooks/useHashRoute.js');
    const catalog = (await vite.ssrLoadModule('/src/pages/Catalog.jsx')).default;
    const detail = (await vite.ssrLoadModule('/src/pages/CourseDetail.jsx')).default;
    const classroom = (await vite.ssrLoadModule('/src/pages/Classroom.jsx')).default;
    const learning = (await vite.ssrLoadModule('/src/pages/MyLearning.jsx')).default;
    const data = JSON.parse(readFileSync(new URL('../mock-api/db.json', import.meta.url), 'utf8'));
    const courses = data.courses.map((raw) => new Course(raw));
    const render = (Page, props) => renderToStaticMarkup(React.createElement(ProgressProvider, {}, React.createElement(Page, props)));
    const home = render(catalog, { courses, categories: data.categories });
    for (const course of courses) assert.ok(home.includes(course.name), `Catalog omitted ${course.name}`);
    assert.equal((home.match(/class="course-card"/g) || []).length, 8);
    assert.ok(home.includes('aria-label="ค้นหาคอร์ส"'));
    const details = render(detail, { course: courses[1] });
    assert.ok(details.includes('Components &amp; Props'));
    assert.ok(details.includes('3 ชม. 40 นาที'));
    const room = render(classroom, { course: courses[1], requestedLessonId: '2-2' });
    assert.ok(room.includes('src="./videos/2-2.mp4"'));
    assert.ok(room.includes('aria-current="step"'));
    assert.ok(room.includes('id="lesson-note"'));
    const fallback = render(classroom, { course: courses[0], requestedLessonId: 'invalid' });
    assert.ok(fallback.includes('src="./videos/1-1.mp4"'));
    const myLearning = render(learning, { courses, initialTab: 'all' });
    assert.ok(myLearning.includes('เริ่มต้นการเรียนรู้ของคุณ'));
    assert.deepEqual(parseRoute('#/learn/2?lesson=2-2'), { page: 'classroom', courseId: '2', lessonId: '2-2' });
    assert.equal(parseRoute('#/unknown').page, 'not-found');
  } finally {
    delete globalThis.window;
    await vite.close();
  }
});
