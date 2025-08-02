# JLK Transservice - ระบบใบเสนอราคา

ระบบใบเสนอราคาที่เรียบง่าย สำหรับรับคำขอใบเสนอราคาจากลูกค้าและส่งข้อมูลไปยังอีเมลบริษัท

## คุณสมบัติ

- ✅ ฟอร์มขอใบเสนอราคาสำหรับลูกค้า
- ✅ ส่งข้อมูลไปยังอีเมลบริษัทโดยอัตโนมัติ
- ✅ บันทึกข้อมูลในฐานข้อมูล SQLite
- ✅ ระบบที่เรียบง่าย ไม่ซับซ้อน

## การตั้งค่าอีเมล

อีเมลได้ตั้งค่าไว้แล้วใน `app.py`:
- SMTP Server: Gmail (smtp.gmail.com)
- อีเมลปลายทาง: jlktransservice@gmail.com
- App Password: ตั้งค่าไว้แล้ว

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

## โครงสร้างไฟล์

```
├── app.py              # แอปพลิเคชันหลัก Flask
├── requirements.txt    # Dependencies
├── index.html         # หน้าแรก
├── quote.html         # ฟอร์มขอใบเสนอราคา
├── services.html      # หน้าบริการ
├── about.html         # หน้าเกี่ยวกับเรา
├── static/
│   ├── css/           # ไฟล์ CSS
│   └── js/            # ไฟล์ JavaScript
└── jlktran.db         # ฐานข้อมูล SQLite

```

## API Endpoints

- `POST /api/quote` - รับข้อมูลใบเสนอราคา
- `GET /api/health` - ตรวจสอบสถานะระบบ

## หมายเหตุ

- ระบบจะส่งอีเมลไปยัง jlktransservice@gmail.com เมื่อมีการขอใบเสนอราคา
- ข้อมูลจะถูกบันทึกในฐานข้อมูล SQLite
- ระบบทำงานในโหมด development (debug=True)
