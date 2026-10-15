# LearnFlow — Online Courses Final Project

เว็บเรียนออนไลน์ด้วย **React** รองรับ Mobile และ Desktop ใช้ข้อมูลคอร์สจาก API ที่โจทย์กำหนด มี Class Model และบันทึกการเรียนผ่าน Browser

## เริ่มใช้งาน

ติดตั้ง Node.js รุ่น 20 ขึ้นไป จาก https://nodejs.org แล้วแตก ZIP และเปิดโฟลเดอร์ `learnflow` ใน VS Code

เปิด Terminal ภายในโฟลเดอร์เดียวกับ `package.json` แล้วรัน:

```bash
npm install
npm run dev
```

เปิด **http://localhost:5173**

คำสั่งเดียวจะเปิดทั้งเว็บ React และ Mock API ที่ **http://localhost:3005** รอให้ Terminal แสดงว่า API ทำงานแล้วก่อนเริ่มใช้เว็บ

บน Windows หาก PowerShell แจ้งว่าไม่อนุญาตให้ใช้ `npm.ps1` ให้เปลี่ยน Terminal เป็น Command Prompt หรือใช้ `npm.cmd install` และ `npm.cmd run dev`

หยุดทั้งเว็บและ API ด้วย **Ctrl+C**

## ฟังก์ชันตามโจทย์

| เงื่อนไข | สิ่งที่ทำในโปรเจกต์ |
| --- | --- |
| React หรือ Next.js | React 19 + Vite |
| รองรับ Mobile และ Desktop | CSS Responsive สำหรับหน้าคอร์ส รายละเอียด ห้องเรียน และการเรียนของฉัน |
| หน้าหลักรวมหลักสูตร | แสดง 8 คอร์สจาก API |
| เลือกหมวดหมู่ | ตัวกรอง Programming, Design, Data Science, Marketing |
| รายละเอียดในคอร์ส | ชื่อ คำอธิบาย จำนวนบท เวลาแต่ละบท และเวลารวม |
| เข้าแต่ละ Lecture | หน้า Classroom และรายการเลือกบทเรียน |
| แสดงวิดีโอแต่ละบท | วิดีโอสาธิตต้นฉบับ 25 ไฟล์ พร้อมภาพ Poster |
| คลิกว่าเรียนจบ | ปุ่มเปลี่ยนสถานะเรียนจบและเปลี่ยนกลับได้ |
| แสดงบทที่เรียนแล้ว | ไอคอนเช็ก ข้อความเรียนจบ และแถบความคืบหน้า |
| กลับมาแล้วข้อมูลยังอยู่ | localStorage เก็บบทที่เรียน คอร์สที่บันทึก บทล่าสุด และโน้ต |
| ใช้ Model แบบ Class | `Course`, `Lecture`, `CourseApi`, `ProgressStore` |
| รับข้อมูลผ่าน API ที่กำหนด | เก็บ `server.js` และ `db.json` ของ aeff60/courses-mock-api ไว้โดยไม่แก้ข้อมูล |

อ่านจุดที่ผู้ตรวจสามารถดูในโค้ดได้ที่ [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)

## ฟังก์ชันเพิ่มเติม

- ค้นหาจากชื่อ คำอธิบาย และหมวดหมู่
- เรียงตามชื่อหรือเวลาเรียนรวม
- บันทึกคอร์สไว้เรียนภายหลัง
- หน้า “การเรียนของฉัน” มีคอร์สที่เริ่มเรียน กำลังเรียน เรียนครบ และคอร์สที่บันทึก
- กลับไปยังบทล่าสุดที่ยังไม่เรียนจบ
- จดโน้ตแยกตามบท และบันทึกอัตโนมัติ
- เมื่อวิดีโอจบ ระบบทำเครื่องหมายบทนี้ให้โดยอัตโนมัติ
- มี Loading, Empty, Error, Retry และข้อความแจ้งเมื่อ Browser ไม่ให้บันทึกข้อมูล
- รองรับการใช้คีย์บอร์ด มีชื่อปุ่มสำหรับ Screen Reader และรองรับ Reduced Motion

## แหล่งข้อมูลและวิดีโอ

API ต้นฉบับ: https://github.com/aeff60/courses-mock-api

API มี **8 คอร์ส 4 หมวดหมู่ 25 บทเรียน** แต่ไม่มี URL วิดีโอ โปรเจกต์จึงสร้างวิดีโอสาธิตใหม่ให้แต่ละบท:

- แต่ละวิดีโอยาว **18 วินาที** มีแนวคิด ตัวอย่าง และข้อสรุปของบทนั้น
- เป็น MP4 H.264 มีคำอธิบายในภาพ ไม่มีเสียงบรรยาย
- เวลา `20 min`, `30 min` ฯลฯ ใน API คือเวลาตามหลักสูตร ไม่ใช่ความยาววิดีโอสาธิต
- ข้อมูลชื่อคอร์ส คำอธิบาย หมวดหมู่ ชื่อบท และเวลาใน API คงเดิม
- ไม่ต้องติดตั้ง Python หรือ FFmpeg เพื่อเปิดเว็บ วิดีโอพร้อมใช้งานอยู่แล้ว
- หากต้องการสร้างวิดีโอใหม่ ใช้ `scripts/generate-videos.py` บน Linux ที่มี Pillow, FFmpeg และ DejaVuSansMono

### API ตอนพัฒนาและตอนเผยแพร่

**ตอนใช้ `npm run dev`:** React เรียก API จริงผ่าน Vite Proxy ไปที่ Mock Server ต้นฉบับ:

| Endpoint | การใช้งาน |
| --- | --- |
| `/courses` | คอร์สทั้งหมด |
| `/courses/:id` | คอร์สเดียว |
| `/categories` | หมวดหมู่ทั้งหมด |
| `/categories/:category/courses` | คอร์สในหมวดหมู่นั้น |

**ตอน `npm run build` โดยไม่ตั้งค่า API ภายนอก:** เว็บสำหรับ Static Hosting เรียก HTTP JSON ที่ `api/courses.json` และ `api/categories.json` ซึ่งมีข้อมูลเดียวกับ API ต้นฉบับ แล้วประมวลผลการค้นหาและกรองผ่าน Class Model ใน Browser จึงเปิดได้โดยไม่ต้องมี Server แยกบน Hosting

หากต้องการใช้ Mock API ที่นำไป Host แล้ว ให้คัดลอก `.env.example` เป็น `.env` และตั้งค่าก่อน Build:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

API ที่ Host ต้องอนุญาต CORS ให้เว็บ และใช้ HTTPS เมื่อเว็บใช้ HTTPS

## โครงสร้างสำคัญ

```text
learnflow/
  src/
    models/       Course และ Lecture
    services/     CourseApi และ ProgressStore
    hooks/        โหลดข้อมูล เส้นทางหน้าเว็บ และ Progress Context
    components/   Header, CourseCard, Icon, ProgressBar และภาพคอร์ส
    pages/        Catalog, CourseDetail, Classroom, MyLearning
    App.jsx       เลือกหน้าและจัดการสถานะโหลดข้อมูล
    styles.css    การออกแบบและ Responsive
  mock-api/       API ต้นฉบับจากโจทย์
  public/api/     JSON ข้อมูลชุดเดียวกันสำหรับ Static Hosting
  public/videos/  วิดีโอและ Poster ของ 25 บท
  public/fonts/   Noto Sans Thai พร้อมใบอนุญาต
  tests/          ทดสอบ Model, API, React Render และ Media
  docs/           แผนผังเงื่อนไข คู่มือทดสอบ และสคริปต์อัดวิดีโอ
  scripts/        เปิดเว็บกับ API และสร้างวิดีโอบทเรียน
```

เว็บใช้ Hash Routing เช่น `#/courses/2` และ `#/learn/2?lesson=2-2` จึงเปิดลิงก์หน้าเรียนโดยตรงบน Static Hosting ได้

## ตรวจโปรเจกต์และ Build

```bash
npm run test
npm run build
npm run preview
```

`npm run preview` เปิดเว็บที่ **http://localhost:4173** และใช้ HTTP JSON สำหรับ Static Hosting

ชุดทดสอบ **13 รายการ** ครอบคลุม API จริง, Model, การบันทึกและกลับมาใช้ข้อมูล, หมวดหมู่, ข้อมูลเสีย, MP4 ของทุกบท และการ Render หน้าด้วย React

ดูสถานะการตรวจและรายการทดลองใน Browser ที่ [docs/TESTING.md](docs/TESTING.md) การทดสอบด้วย React Render ไม่ได้แทนการทดลองคลิกและดูวิดีโอบน Browser จริง

## ส่งงานผ่าน GitHub Public

1. เข้า https://github.com/new และสร้าง Repository ชื่อ `learnflow-final-project` โดยเลือก **Public**
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วใช้คำสั่งด้านล่าง เปลี่ยน `YOUR_USERNAME` เป็นชื่อ GitHub ของคุณ

```bash
git init
git add .
git commit -m "Build LearnFlow online courses final project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learnflow-final-project.git
git push -u origin main
```

ไม่ส่งโฟลเดอร์ `node_modules`, `dist` หรือไฟล์ `.env` ขึ้น GitHub

Repository ที่สร้างจริงคือสิ่งที่ต้องส่งให้ผู้สอน ไฟล์ ZIP ที่ดาวน์โหลดจากแชตยังไม่ใช่ GitHub Repository และลิงก์เว็บตัวอย่างไม่ได้แทน Repository แบบ Public

### เปิดเว็บผ่าน GitHub Pages

มี Workflow เตรียมไว้ใน `.github/workflows/deploy.yml` ให้เลือก **Settings → Pages → Build and deployment → Source: GitHub Actions** ใน Repository แล้วเปิดแท็บ Actions เพื่อสั่ง Run Workflow หรือ Push โค้ดใหม่

Workflow จะติดตั้ง dependencies ทดสอบ Build และ Deploy โฟลเดอร์ `dist` คุณควรเปิดลิงก์ที่ระบบแสดงหลัง Deploy เพื่อทดสอบอีกครั้ง

## วิดีโอประกอบการส่งงาน

วิดีโอบทเรียน 25 ไฟล์ **ไม่ใช่วิดีโอสาธิตการใช้เว็บที่ผู้สอนขอ** คุณยังต้องอัดวิดีโอหน้าจอการใช้เว็บของคุณ โดยมีสคริปต์และขั้นตอนพร้อมแล้วที่ [docs/DEMO_SCRIPT_TH.md](docs/DEMO_SCRIPT_TH.md)

ควรแสดงการกรองคอร์ส รายละเอียด เปิดวิดีโอ กดเรียนจบ ปิดและเปิดเว็บใหม่ และหน้าจอ Mobile ใช้เวลาประมาณ 4–5 นาที

ก่อนส่ง เปลี่ยนชื่อผู้จัดทำใน [docs/SUBMISSION.md](docs/SUBMISSION.md) ใส่ลิงก์ GitHub แบบ Public และลิงก์วิดีโอที่ผู้ตรวจเปิดดูได้ แล้วอ่านเงื่อนไขของผู้สอนอีกครั้ง คะแนนและ Certificate ขึ้นกับการตรวจจริงและ Final Quiz ของผู้เรียน

## ขอบเขตข้อมูลส่วนตัว

ไม่มีระบบ Login และไม่มีฐานข้อมูลผู้ใช้บน Server ข้อมูลการเรียนเก็บใน Browser และอุปกรณ์ที่ใช้งานเท่านั้น ไม่ย้ายตามไปยัง Browser หรือเครื่องอื่น หากล้างข้อมูลเว็บไซต์ ข้อมูลการเรียนจะถูกลบ

## Credits

- Mock course data and API: aeff60/courses-mock-api — ดู `mock-api/UPSTREAM.md`
- Noto Sans Thai: Google Fonts / Noto — SIL Open Font License ใน `public/fonts/OFL.txt`
- Course artwork, UI and short instructional demo videos: created for this project
