import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Course } from '../src/models/Course.js';
import { Lecture } from '../src/models/Lecture.js';
import { ProgressStore, STORAGE_KEY } from '../src/services/ProgressStore.js';

const data = JSON.parse(readFileSync(new URL('../mock-api/db.json', import.meta.url), 'utf8'));
const course = new Course(data.courses[1]);
class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
}
test('API data is converted to Course/Lecture classes with correct totals', () => {
  assert.ok(course instanceof Course);
  assert.ok(course.lectures[0] instanceof Lecture);
  assert.equal(course.totalMinutes, 220);
  assert.equal(course.durationLabel, '3 ชม. 40 นาที');
  assert.equal(data.courses.map((item) => new Course(item)).reduce((sum, item) => sum + item.lectureCount, 0), 25);
  assert.throws(() => new Course({}), TypeError);
});
test('search supports titles, Thai descriptions and whitespace', () => {
  assert.ok(course.matches(' REACT '));
  assert.ok(course.matches('แอปพลิเคชัน'));
  assert.equal(course.matches('does not exist'), false);
});
test('completion, bookmark, resume lesson and notes survive reopening', () => {
  const storage = new MemoryStorage();
  const first = new ProgressStore(storage);
  first.visit(course, '2-2');
  first.setCompleted(course, '2-1', true);
  first.toggleBookmark(course.id);
  first.setNote(course, '2-2', 'Props ส่งข้อมูลไปยัง Component ลูก');
  const reopened = new ProgressStore(storage);
  assert.equal(reopened.percent(course), 25);
  assert.equal(reopened.nextLessonId(course), '2-2');
  assert.equal(reopened.entry(course.id).bookmarked, true);
  assert.equal(reopened.entry(course.id).notes['2-2'], 'Props ส่งข้อมูลไปยัง Component ลูก');
  assert.ok(reopened.entry(course.id).lastOpenedAt > 0);
});
test('completion is idempotent, reversible and rejects unknown lecture ids', () => {
  const store = new ProgressStore(new MemoryStorage());
  store.setCompleted(course, '2-1', true);
  store.setCompleted(course, '2-1', true);
  store.setCompleted(course, '1-1', true);
  assert.deepEqual(store.completedIds(course), ['2-1']);
  store.setCompleted(course, '2-1', false);
  assert.equal(store.percent(course), 0);
  store.visit(course, 'not-a-lesson');
  assert.equal(store.entry(course.id).lastLessonId, null);
});
test('all lectures yield 100% and stale ids cannot inflate progress', () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, courses: { '2': { completedLessonIds: ['2-1', '2-1', 'removed-id'] } } }));
  const store = new ProgressStore(storage);
  assert.equal(store.percent(course), 25);
  for (const lesson of course.lectures) store.setCompleted(course, lesson.id, true);
  assert.equal(store.percent(course), 100);
  assert.equal(store.nextLessonId(course), '2-1');
});
test('corrupt storage and blocked storage do not crash the application', () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, '{broken');
  const store = new ProgressStore(storage);
  assert.equal(store.percent(course), 0);
  assert.ok(store.error);
  store.setCompleted(course, '2-1', true);
  assert.equal(store.error, '');
  const blocked = new ProgressStore({ getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } });
  blocked.setCompleted(course, '2-1', true);
  assert.equal(blocked.percent(course), 25);
  assert.ok(blocked.error.includes('ไม่อนุญาต'));
});
test('reset removes progress, bookmarks and notes together', () => {
  const storage = new MemoryStorage();
  const store = new ProgressStore(storage);
  store.setCompleted(course, '2-1', true);
  store.toggleBookmark(course.id);
  store.setNote(course, '2-1', 'My note');
  store.reset();
  const reopened = new ProgressStore(storage);
  assert.equal(reopened.percent(course), 0);
  assert.equal(reopened.entry(course.id).bookmarked, false);
  assert.deepEqual(reopened.entry(course.id).notes, {});
});
