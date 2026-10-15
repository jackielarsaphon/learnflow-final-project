import { Course } from '../models/Course.js';

export class CourseApi {
  // Wrap fetch so it is always called with globalThis as `this`; calling it as this.fetcher() throws "Illegal invocation" in browsers.
  constructor({ baseUrl = '', staticMode = false, fetcher = (...args) => globalThis.fetch(...args) } = {}) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.staticMode = staticMode;
    this.fetcher = fetcher;
  }
  async request(path, signal) {
    const response = await this.fetcher(`${this.baseUrl}${path}`, { signal });
    if (!response.ok) {
      if (response.status === 404) throw new Error('ไม่พบข้อมูลที่ร้องขอ');
      throw new Error(`โหลดข้อมูลไม่สำเร็จ (${response.status})`);
    }
    return response.json();
  }
  async getCourses(signal) {
    const data = await this.request(this.staticMode ? '/courses.json' : '/courses', signal);
    if (!Array.isArray(data)) throw new TypeError('ข้อมูลคอร์สต้องเป็น Array');
    return data.map((item) => new Course(item));
  }
  async getCategories(signal) {
    const data = await this.request(this.staticMode ? '/categories.json' : '/categories', signal);
    if (!Array.isArray(data) || data.some((item) => typeof item !== 'string')) throw new TypeError('หมวดหมู่ไม่ถูกต้อง');
    return data;
  }
  async getCourse(id, signal) {
    if (this.staticMode) {
      const course = (await this.getCourses(signal)).find((item) => item.id === String(id));
      if (!course) throw new Error('ไม่พบคอร์สนี้');
      return course;
    }
    return new Course(await this.request(`/courses/${encodeURIComponent(id)}`, signal));
  }
  async getCoursesByCategory(category, signal) {
    if (this.staticMode) return (await this.getCourses(signal)).filter((course) => course.category === category);
    const data = await this.request(`/categories/${encodeURIComponent(category)}/courses`, signal);
    if (!Array.isArray(data)) throw new TypeError('ข้อมูลคอร์สไม่ถูกต้อง');
    return data.map((item) => new Course(item));
  }
}
