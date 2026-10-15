import { Lecture } from './Lecture.js';

export class Course {
  constructor(data = {}) {
    if (!data.id || !data.name || !data.category || !Array.isArray(data.coursesDtl)) {
      throw new TypeError('Course requires id, name, category and coursesDtl');
    }
    this.id = String(data.id);
    this.name = String(data.name);
    this.description = String(data.description || '');
    this.category = String(data.category);
    this.image = String(data.image || '');
    this.lectures = data.coursesDtl.map((lecture) => new Lecture(lecture));
  }
  get totalMinutes() { return this.lectures.reduce((sum, lesson) => sum + lesson.durationMinutes, 0); }
  get lectureCount() { return this.lectures.length; }
  get durationLabel() {
    const hours = Math.floor(this.totalMinutes / 60);
    const minutes = this.totalMinutes % 60;
    return [hours ? `${hours} ชม.` : '', minutes ? `${minutes} นาที` : ''].filter(Boolean).join(' ') || '0 นาที';
  }
  getLecture(id) { return this.lectures.find((lecture) => lecture.id === String(id)) || null; }
  matches(query = '') {
    const text = `${this.name} ${this.description} ${this.category}`.toLocaleLowerCase();
    return text.includes(query.trim().toLocaleLowerCase());
  }
}
