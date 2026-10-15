# จุดตรวจตามเงื่อนไข Final Project

| เงื่อนไข | ทดลองตรงไหน | ไฟล์ที่เกี่ยวข้อง |
| --- | --- | --- |
| ใช้ React | ดู Component และ Hooks | src/main.jsx, src/App.jsx |
| Mobile + Desktop | ลดขนาดหน้าจอ ตรวจหน้าหลักและห้องเรียน | src/styles.css |
| แสดงคอร์สทั้งหมด | หน้าหลักเริ่มที่ 8 คอร์ส | src/pages/Catalog.jsx |
| กรองหมวดหมู่ | กด Design ต้องเหลือ 2 คอร์ส | src/pages/Catalog.jsx |
| แสดงรายละเอียดภายในคอร์ส | เปิด React.js for Beginners | src/pages/CourseDetail.jsx |
| ชื่อ คำอธิบาย บทและเวลา | ดูเนื้อหาคอร์สและเวลา 3 ชม. 40 นาที | src/models/Course.js, src/models/Lecture.js |
| ดูวิดีโอแต่ละ Lecture | กด What is React? แล้วกด Play | src/pages/Classroom.jsx, public/videos/2-1.mp4 |
| คลิกเรียนจบ | กดปุ่มและตรวจ 25% ในคอร์ส React | src/pages/Classroom.jsx |
| เปลี่ยนไอคอน/ข้อความ | Sidebar แสดงเครื่องหมายเช็กและเรียนจบแล้ว | src/pages/Classroom.jsx |
| บันทึกผ่าน Browser | ปิดและเปิด URL เดิมใน Browser เดิม | src/services/ProgressStore.js, src/hooks/useProgress.jsx |
| Class Model | DTO จาก API ถูกแปลงเป็น new Course และ new Lecture | src/services/CourseApi.js, src/models/ |
| API จาก Repository ที่กำหนด | รัน npm run dev และดู GET /courses | mock-api/server.js, mock-api/db.json |

ส่วนเสริมสำหรับผู้ตรวจพิจารณา ได้แก่ Search, Sort, Bookmark, Dashboard การเรียน, Resume Lesson, Notes, Auto Complete เมื่อวิดีโอจบ, Error Retry และ Accessibility

การส่งงานยังต้องมี Repository แบบ Public และวิดีโออัดหน้าจอประกอบการใช้งาน ดู README และ DEMO_SCRIPT_TH.md
