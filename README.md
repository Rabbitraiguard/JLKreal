# JLK Transservice Website

ระบบเว็บไซต์โลจิสติกส์ที่เรียบง่าย ใช้ Formspree สำหรับการส่งอีเมลและ Flask สำหรับการเสิร์ฟเว็บไซต์

## คุณสมบัติ

- ✅ รองรับภาษาไทยและอินพุตมือถือ
- ✅ ระบบ responsive และ mobile-friendly  
- ✅ ส่งอีเมลผ่าน Formspree โดยอัตโนมัติ
- ✅ ระบบจัดการฟอร์มแบบสมบูรณ์
- ✅ การแจ้งเตือนแบบ toast
- ✅ การอัปโหลดไฟล์สำหรับใบเสนอราคา

## การตั้งค่าระบบอีเมล

ระบบใช้ Formspree (https://formspree.io) สำหรับการส่งอีเมล:
- Formspree Endpoint: https://formspree.io/f/xovlnjoy
- อีเมลปลายทาง: jlktransservice@gmail.com

## การติดตั้ง

1. Clone repository
2. ติดตั้ง dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. รันเซิร์ฟเวอร์:
   ```bash
   python app.py
   ```

## โครงสร้างไฟล์

```
/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── index.html            # หน้าแรก
├── about.html            # เกี่ยวกับเรา
├── services.html         # บริการ
├── contact.html          # ติดต่อเรา
├── quote.html            # ขอใบเสนอราคา
├── 404.html              # หน้า error
├── static/
│   ├── css/
│   │   └── style.css     # Custom styles
│   └── js/
│       ├── main.js       # JavaScript หลัก
│       └── quote.js      # Quote form handling
└── public/               # Static assets
```

## การใช้งาน

### หน้าหลัก (index.html)
- แสดงข้อมูลบริษัทและบริการ
- ปุ่มเรียกใช้งาน Call-to-Action
- ข้อมูลติดต่อ

### หน้าบริการ (services.html)
- รายละเอียดบริการทั้งหมด
- การจัดหมวดหมู่บริการ

### หน้าติดต่อ (contact.html)
- ฟอร์มติดต่อพื้นฐาน
- แผนที่ Google Maps
- ข้อมูลติดต่อครบถ้วน

### หน้าขอใบเสนอราคา (quote.html)
- ฟอร์มขอใบเสนอราคาแบบละเอียด
- อัปโหลดไฟล์รูปภาพ
- ฟิลด์ครบถ้วนสำหรับข้อมูลขนส่ง

## การส่งอีเมล

ระบบใช้ Formspree:
- ระบบส่งอีเมลผ่าน Formspree ไปยัง jlktransservice@gmail.com
- ฟอร์มทั้งหมดส่งข้อมูลตรงไปยัง Formspree แบบไม่ผ่านเซิร์ฟเวอร์
- รองรับการแนบไฟล์รูปภาพในฟอร์มใบเสนอราคา

## การพัฒนา

สำหรับการพัฒนาต่อ:
1. ใช้ Flask development server สำหรับการทดสอบ
2. ปรับแต่ง CSS ใน `static/css/style.css`
3. JavaScript customization ใน `static/js/`
