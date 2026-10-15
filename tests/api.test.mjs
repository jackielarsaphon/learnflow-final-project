import test from 'node:test';
import assert from 'node:assert/strict';
import { CourseApi } from '../src/services/CourseApi.js';
import { Course } from '../src/models/Course.js';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const data = JSON.parse(readFileSync(new URL('../mock-api/db.json', import.meta.url), 'utf8'));
test('REST client uses supplied endpoint contract and encodes category names', async () => {
  const requests = [];
  const api = new CourseApi({ baseUrl: 'https://api.example.test/', fetcher: async (url) => {
    requests.push(url);
    const payload = url.includes('/categories/Data%20Science/courses') ? data.courses.filter((item) => item.category === 'Data Science') : url.endsWith('/courses/1') ? data.courses[0] : url.endsWith('/categories') ? data.categories : data.courses;
    return { ok: true, json: async () => payload };
  } });
  assert.ok((await api.getCourses())[0] instanceof Course);
  assert.equal((await api.getCourse('1')).id, '1');
  assert.equal((await api.getCategories()).length, 4);
  assert.equal((await api.getCoursesByCategory('Data Science')).length, 2);
  assert.deepEqual(requests, ['https://api.example.test/courses','https://api.example.test/courses/1','https://api.example.test/categories','https://api.example.test/categories/Data%20Science/courses']);
});
test('hosted HTTP JSON mode preserves upstream data and category behavior', async () => {
  const api = new CourseApi({ baseUrl: './api', staticMode: true, fetcher: async (url) => ({ ok: true, json: async () => url.endsWith('categories.json') ? data.categories : data.courses }) });
  assert.equal((await api.getCourses()).length, 8);
  assert.equal((await api.getCourse('2')).name, 'React.js for Beginners');
  assert.deepEqual((await api.getCoursesByCategory('Design')).map((item) => item.id), ['4','5']);
  await assert.rejects(api.getCourse('missing'), /ไม่พบ/);
});
test('HTTP and malformed-data failures are surfaced for retry UI', async () => {
  const failed = new CourseApi({ fetcher: async () => ({ ok: false, status: 503 }) });
  await assert.rejects(failed.getCourses(), /503/);
  const malformed = new CourseApi({ fetcher: async () => ({ ok: true, json: async () => ({ courses: [] }) }) });
  await assert.rejects(malformed.getCourses(), TypeError);
});
test('actual unmodified upstream API serves courses, detail, categories and errors', async () => {
  const child = spawn(process.execPath, ['mock-api/server.js'], { cwd: new URL('..', import.meta.url), stdio: ['ignore','pipe','pipe'] });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  try {
    const ready = await Promise.race([
      new Promise((resolve, reject) => {
        const deadline = setTimeout(() => reject(new Error(`API startup timed out: ${output}`)), 8000);
        child.stdout.on('data', () => { if (output.includes('running on')) { clearTimeout(deadline); resolve(true); } });
        child.once('error', (error) => { clearTimeout(deadline); reject(error); });
        child.once('exit', (code) => { clearTimeout(deadline); reject(new Error(`API exited ${code}: ${output}`)); });
      }),
    ]);
    assert.ok(ready);
    const api = new CourseApi({ baseUrl: 'http://127.0.0.1:3005' });
    assert.equal((await api.getCourses()).length, 8);
    assert.equal((await api.getCourse('1')).lectureCount, 3);
    assert.deepEqual(await api.getCategories(), data.categories);
    assert.equal((await api.getCoursesByCategory('Data Science')).length, 2);
    await assert.rejects(api.getCourse('9999'), /ไม่พบ/);
  } finally {
    if (child.exitCode === null) { const stopped = once(child, 'exit'); child.kill('SIGTERM'); await stopped; }
  }
});
