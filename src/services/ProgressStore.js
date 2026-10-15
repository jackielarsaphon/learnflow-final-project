export const STORAGE_KEY = 'learnflow.progress.v1';
const emptyState = () => ({ schemaVersion: 1, courses: {} });

export class ProgressStore {
  constructor(storage) {
    this.storage = storage;
    this.error = '';
    this.data = emptyState();
    this.reload();
  }
  reload() {
    this.error = '';
    try {
      const raw = this.storage?.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.schemaVersion !== 1 || !parsed.courses || typeof parsed.courses !== 'object' || Array.isArray(parsed.courses)) {
        throw new Error('Invalid progress schema');
      }
      this.data = parsed;
    } catch {
      this.data = emptyState();
      this.error = 'อ่านข้อมูลการเรียนเดิมไม่ได้ กรุณาบันทึกความคืบหน้าใหม่';
    }
  }
  save() {
    try {
      if (!this.storage) throw new Error('Storage unavailable');
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.error = '';
    } catch {
      this.error = 'เบราว์เซอร์ไม่อนุญาตให้บันทึกข้อมูล ความคืบหน้าจะอยู่เฉพาะรอบนี้';
    }
  }
  entry(courseId) {
    const existing = this.data.courses[String(courseId)];
    return {
      completedLessonIds: Array.isArray(existing?.completedLessonIds) ? existing.completedLessonIds.filter((id) => typeof id === 'string') : [],
      lastLessonId: typeof existing?.lastLessonId === 'string' ? existing.lastLessonId : null,
      lastOpenedAt: Number.isFinite(existing?.lastOpenedAt) ? existing.lastOpenedAt : 0,
      bookmarked: existing?.bookmarked === true,
      notes: existing?.notes && typeof existing.notes === 'object' && !Array.isArray(existing.notes) ? existing.notes : {},
    };
  }
  update(courseId, updater) {
    this.data.courses[String(courseId)] = updater(this.entry(courseId));
    this.save();
  }
  visit(course, lessonId) {
    const lesson = course.getLecture(lessonId);
    if (!lesson) return;
    this.update(course.id, (entry) => ({ ...entry, lastLessonId: lesson.id, lastOpenedAt: Date.now() }));
  }
  setCompleted(course, lessonId, completed) {
    if (!course.getLecture(lessonId)) return;
    const valid = new Set(course.lectures.map((lesson) => lesson.id));
    this.update(course.id, (entry) => {
      const ids = new Set(entry.completedLessonIds.filter((id) => valid.has(id)));
      if (completed) ids.add(String(lessonId)); else ids.delete(String(lessonId));
      return { ...entry, completedLessonIds: [...ids] };
    });
  }
  toggleBookmark(courseId) {
    this.update(courseId, (entry) => ({ ...entry, bookmarked: !entry.bookmarked }));
  }
  setNote(course, lessonId, note) {
    if (!course.getLecture(lessonId)) return;
    this.update(course.id, (entry) => ({ ...entry, notes: { ...entry.notes, [lessonId]: String(note).slice(0, 5000) } }));
  }
  completedIds(course) {
    const valid = new Set(course.lectures.map((lesson) => lesson.id));
    return [...new Set(this.entry(course.id).completedLessonIds)].filter((id) => valid.has(id));
  }
  isCompleted(course, lessonId) { return this.completedIds(course).includes(String(lessonId)); }
  percent(course) { return course.lectureCount ? Math.round(this.completedIds(course).length / course.lectureCount * 100) : 0; }
  nextLessonId(course) {
    const entry = this.entry(course.id);
    if (entry.lastLessonId && course.getLecture(entry.lastLessonId) && !this.isCompleted(course, entry.lastLessonId)) return entry.lastLessonId;
    return course.lectures.find((lesson) => !this.isCompleted(course, lesson.id))?.id || course.lectures[0]?.id || null;
  }
  reset() { this.data = emptyState(); this.save(); }
}
