# JLK Transservice - ระบบใบเสนอราคาและการติดต่อ

ระบบใบเสนอราคาและการติดต่อที่เรียบง่าย ใช้ Formspree สำหรับการส่งอีเมลและ Flask สำหรับการจัดการข้อมูล

## คุณสมบัติ

- ✅ ฟอร์มขอใบเสนอราคาสำหรับลูกค้า
- ✅ ฟอร์มติดต่อสำหรับการสื่อสาร
- ✅ ส่งอีเมลผ่าน Formspree โดยอัตโนมัติ
- ✅ บันทึกข้อมูลในฐานข้อมูล SQLite
- ✅ ระบบที่เรียบง่าย ไม่ซับซ้อน
- ✅ ไม่ต้องตั้งค่า SMTP หรือ email server

## การตั้งค่าอีเมล

ระบบใช้ Formspree (https://formspree.io) สำหรับการส่งอีเมล:
- Formspree Endpoint: https://formspree.io/f/xovlnjoy
- อีเมลปลายทาง: jlktransservice@gmail.com
- ไม่ต้องตั้งค่า SMTP หรือ App Password

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
# สร้าง virtual environment
python3 -m venv venv

# เปิดใช้งาน virtual environment
source venv/bin/activate

# ติดตั้ง packages
pip install -r requirements.txt
```

### 2. รันระบบ

```bash
# เปิดใช้งาน virtual environment (ถ้ายังไม่ได้เปิด)
source venv/bin/activate

# รันแอปพลิเคชัน
python app.py
```

### 3. เข้าใช้งาน

เปิดเบราว์เซอร์และไปที่:
- หน้าแรก: http://localhost:5000/
- ฟอร์มขอใบเสนอราคา: http://localhost:5000/quote.html
- หน้าติดต่อ: http://localhost:5000/contact.html

## โครงสร้างไฟล์

```
├── app.py              # แอปพลิเคชันหลัก Flask
├── requirements.txt    # Dependencies
├── index.html         # หน้าแรก
├── quote.html         # ฟอร์มขอใบเสนอราคา
├── contact.html       # หน้าติดต่อ
├── services.html      # หน้าบริการ
├── about.html         # หน้าเกี่ยวกับเรา
├── static/
│   ├── css/           # ไฟล์ CSS
│   └── js/            # ไฟล์ JavaScript
└── jlktran.db         # ฐานข้อมูล SQLite

```

## API Endpoints

- `POST /api/quote` - บันทึกข้อมูลใบเสนอราคา
- `POST /api/contact` - บันทึกข้อความติดต่อ
- `GET /api/health` - ตรวจสอบสถานะระบบ

## หมายเหตุ

- ระบบส่งอีเมลผ่าน Formspree ไปยัง jlktransservice@gmail.com
- ข้อมูลจะถูกบันทึกในฐานข้อมูล SQLite เพื่อการสำรองข้อมูล
- ระบบทำงานในโหมด development (debug=True)
- ไม่ต้องตั้งค่า SMTP server หรือ email password
