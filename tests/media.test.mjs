import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('every upstream lecture has its own nonempty original video and poster', () => {
  const data = JSON.parse(readFileSync(new URL('../mock-api/db.json', import.meta.url), 'utf8'));
  for (const course of data.courses) for (const lesson of course.coursesDtl) {
    const video = new URL(`../public/videos/${lesson.id}.mp4`, import.meta.url);
    const poster = new URL(`../public/videos/${lesson.id}.jpg`, import.meta.url);
    assert.ok(existsSync(video), `Missing video ${lesson.id}`);
    assert.ok(existsSync(poster), `Missing poster ${lesson.id}`);
    const bytes = readFileSync(video);
    assert.ok(bytes.length > 1000, `Empty video ${lesson.id}`);
    assert.equal(bytes.subarray(4, 8).toString(), 'ftyp', `Not an MP4: ${lesson.id}`);
  }
});
