export class Lecture {
  constructor(data = {}) {
    if (!data.id || !data.title) throw new TypeError('Lecture requires id and title');
    this.id = String(data.id);
    this.title = String(data.title);
    this.duration = String(data.duration || '0 min');
    this.durationMinutes = Number.parseInt(this.duration, 10) || 0;
    // The supplied API contains no video field. Each lecture gets an original,
    // clearly labelled short instructional demo from this project's assets.
    this.videoUrl = `./videos/${encodeURIComponent(this.id)}.mp4`;
    this.posterUrl = `./videos/${encodeURIComponent(this.id)}.jpg`;
    this.videoLabel = 'วิดีโอสาธิตสั้นที่เพิ่มสำหรับโปรเจกต์';
  }
}
