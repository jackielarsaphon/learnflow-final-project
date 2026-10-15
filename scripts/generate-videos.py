"""Generate original, captioned 18-second lesson demos. Requires Pillow + ffmpeg.

Usage: python scripts/generate-videos.py
No third-party footage, network calls or voice recordings are used.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'videos'
CONTENT = json.loads((ROOT / 'scripts' / 'lesson-content.json').read_text())
DATA = json.loads((ROOT / 'mock-api' / 'db.json').read_text())
FONT = ROOT / 'public' / 'fonts' / 'NotoSansThai-Regular.ttf'
BOLD = ROOT / 'public' / 'fonts' / 'NotoSansThai-Bold.ttf'
MONO = Path('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf')
W, H = 1280, 720

def font(size, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), size)

def wrap_text(text, width, draw, face):
    lines = []
    line = ''
    for char in text:
        if char == '\n':
            lines.append(line)
            line = ''
        elif draw.textlength(line + char, font=face) > width:
            lines.append(line)
            line = char
        else:
            line += char
    if line:
        lines.append(line)
    return lines

def text_block(draw, text, xy, face, fill, width, spacing=12):
    x, y = xy
    for line in wrap_text(text, width, draw, face):
        draw.text((x, y), line, font=face, fill=fill)
        y += face.size + spacing
    return y

def slide(course, lesson, number):
    content = CONTENT[lesson['id']]
    image = Image.new('RGB', (W, H), '#f5f4fd')
    d = ImageDraw.Draw(image)
    d.ellipse((940, -240, 1550, 370), fill='#e9e5fa')
    d.ellipse((-160, 560, 300, 1000), fill='#ebe8fb')
    d.rounded_rectangle((45, 36, 95, 86), 15, fill='#6558e8')
    d.text((61, 40), 'L', font=font(30, True), fill='white')
    d.text((110, 40), 'learnflow.', font=font(27, True), fill='#3a334e')
    d.text((920, 47), 'LESSON DEMO  /  18 SEC', font=font(16), fill='#8e82af')
    d.line((50, 110, 1230, 110), fill='#ded8ec', width=2)
    text_block(d, course['name'], (60, 143), font(18), '#847997', 1130)
    text_block(d, lesson['title'], (60, 178), font(39, True), '#2d263e', 1130, 14)
    section = ['01  CONCEPT', '02  EXAMPLE', '03  TAKEAWAY'][number]
    d.text((60, 269), section, font=font(16, True), fill='#6558e8')
    if number == 0:
        d.rounded_rectangle((60, 320, 1220, 584), 22, fill='white', outline='#e4deed', width=2)
        text_block(d, content[0], (92, 354), font(31, True), '#4b3e69', 1080, 14)
        text_block(d, content[1], (92, 418), font(26), '#7a6e8f', 1080, 16)
    elif number == 1:
        d.rounded_rectangle((60, 320, 1220, 584), 22, fill='#2d2942')
        code_face = ImageFont.truetype(str(MONO), 25)
        for row, line in enumerate(content[2].splitlines()):
            d.text((91, 342 + row*37), f'{row+1:02}', font=ImageFont.truetype(str(MONO), 19), fill='#847595')
            d.text((145, 341 + row*37), line, font=code_face, fill='#d8e9d7')
    else:
        d.rounded_rectangle((60, 320, 1220, 584), 22, fill='#e8f4ec', outline='#d4e9dc', width=2)
        d.text((92, 350), 'ลองคิด แล้วลงมือทำ', font=font(31, True), fill='#36735b')
        text_block(d, content[3], (92, 420), font(26), '#627d70', 1080, 16)
    d.text((60, 635), 'สื่อสาธิตสั้นสำหรับโปรเจกต์ · ไม่ใช่วิดีโอหลักสูตรเต็ม', font=font(17), fill='#a39aaa')
    d.text((1080, 635), f'{number+1} / 3', font=font(20), fill='#9b8fae')
    d.rounded_rectangle((60, 682, 1220, 688), 3, fill='#e3deeb')
    d.rounded_rectangle((60, 682, 60+int(1160*(number+1)/3), 688), 3, fill='#8e80d3')
    return image

def generate(pair):
    course, lesson = pair
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='learnflow-media-') as temporary:
        temp = Path(temporary)
        for n in range(3):
            frame = slide(course, lesson, n)
            frame.save(temp / f'{n}.png')
            if n == 0:
                frame.save(OUT / f'{lesson["id"]}.jpg', quality=90)
        playlist = temp / 'frames.txt'
        playlist.write_text(''.join(f"file '{temp/n.__str__()}.png'\nduration 6\n" for n in range(3)) + f"file '{temp}/2.png'\n")
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(playlist),'-t','18','-vf','fps=12','-c:v','libx264','-threads','1','-preset','veryfast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT / f'{lesson["id"]}.mp4')], check=True)
    return lesson['id']

if __name__ == '__main__':
    lessons = [(course, lesson) for course in DATA['courses'] for lesson in course['coursesDtl']]
    with ThreadPoolExecutor(max_workers=3) as pool:
        for lesson_id in pool.map(generate, lessons):
            print(f'Created lesson {lesson_id}', flush=True)
    print(f'Done: {len(lessons)} original lesson videos', flush=True)
