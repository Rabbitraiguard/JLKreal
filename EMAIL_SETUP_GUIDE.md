# 📧 คู่มือการตั้งค่าระบบอีเมลสำหรับ JLK Transservice

## 🎯 ภาพรวมระบบ

ระบบฟอร์มของ JLK Transservice ประกอบด้วย:
- **ฟอร์มขอใบเสนอราคา** (`quote.html`) - ลูกค้ากรอกข้อมูลเพื่อขอใบเสนอราคา
- **ฟอร์มติดต่อเรา** (`contact.html`) - ลูกค้าส่งข้อความสอบถาม
- **Flask Backend** (`app.py`) - จัดการการส่งอีเมลและบันทึกข้อมูล
- **Database** (SQLite) - เก็บข้อมูลคำขอทั้งหมด

## 🔧 การตั้งค่าเบื้องต้น

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง Python packages
pip install -r requirements.txt
```

### 2. ตั้งค่า Gmail App Password

#### วิธีสร้าง Gmail App Password:

1. **เข้าสู่ Gmail Account**
   - ไปที่ [Google Account Settings](https://myaccount.google.com/)

2. **เปิดใช้งาน 2-Step Verification**
   - Security → 2-Step Verification
   - ทำตามขั้นตอนเพื่อเปิดใช้งาน

3. **สร้าง App Password**
   - Security → App passwords
   - เลือก "Mail" และ "Other (Custom name)"
   - ตั้งชื่อ: "JLK Transservice"
   - คัดลอก password ที่ได้ (รูปแบบ: xxxx xxxx xxxx xxxx)

### 3. แก้ไขไฟล์ .env

แก้ไขไฟล์ `.env` และใส่ข้อมูลที่ถูกต้อง:

```env
# ใส่ App Password ที่ได้จาก Gmail
EMAIL_PASSWORD=abcd efgh ijkl mnop

# ตั้งค่าอีเมลที่จะรับแจ้งเตือน
COMPANY_EMAILS=jlktransservice@gmail.com,admin@yourcompany.com
```

## 🚀 การเริ่มใช้งาน

### 1. เริ่มต้นเซิร์ฟเวอร์

```bash
# วิธีที่ 1: รันด้วย Python
python app.py

# วิธีที่ 2: รันด้วย Flask CLI
flask run

# วิธีที่ 3: รันด้วย Gunicorn (สำหรับ production)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

เซิร์ฟเวอร์จะทำงานที่: `http://localhost:5000`

### 2. ทดสอบระบบ

#### ทดสอบการส่งอีเมล:
```bash
# เรียกใช้ API ทดสอบ
curl -X POST http://localhost:5000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com"}'
```

#### ทดสอบฟอร์ม:
1. เปิดเว็บไซต์: `http://localhost:5000`
2. ไปที่หน้า "ขอใบเสนอราคา" หรือ "ติดต่อเรา"
3. กรอกข้อมูลและส่งฟอร์ม
4. ตรวจสอบอีเมลที่ได้รับ

## 📋 ฟีเจอร์ที่มีอยู่

### ฟอร์มขอใบเสนอราคา
- ✅ กรอกข้อมูลบริษัทและผู้ติดต่อ
- ✅ เลือกประเภทบริการและความเร่งด่วน
- ✅ ระบุจุดต้นทาง-ปลายทาง
- ✅ ข้อมูลสินค้า (ประเภท, น้ำหนัก, ขนาด)
- ✅ บริการเสริม (checkbox)
- ✅ รายละเอียดเพิ่มเติม
- ✅ ส่งอีเมลยืนยันให้ลูกค้า
- ✅ ส่งแจ้งเตือนให้ทีมงาน
- ✅ บันทึกข้อมูลในฐานข้อมูล

### ฟอร์มติดต่อเรา
- ✅ ข้อมูลผู้ติดต่อ (ชื่อ, อีเมล, โทรศัพท์)
- ✅ หัวข้อและข้อความ
- ✅ ส่งอีเมลยืนยันให้ลูกค้า
- ✅ แจ้งเตือนทีมงาน
- ✅ บันทึกข้อมูลในฐานข้อมูล

### ระบบอีเมล
- ✅ อีเมล HTML สวยงาม
- ✅ รหัสอ้างอิง (Reference ID)
- ✅ ส่งให้หลายอีเมลพร้อมกัน
- ✅ ข้อมูลครบถ้วนในอีเมล
- ✅ Responsive design

## 🔍 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. ส่งอีเมลไม่ได้
```
Error: SMTPAuthenticationError
```
**วิธีแก้:**
- ตรวจสอบ App Password ใน `.env`
- ตรวจสอบว่าเปิด 2-Step Verification แล้ว
- ตรวจสอบชื่อผู้ใช้ Gmail

#### 2. ฟอร์มไม่ส่งข้อมูล
```
Error: 404 Not Found
```
**วิธีแก้:**
- ตรวจสอบว่าเซิร์ฟเวอร์ Flask ทำงานอยู่
- ตรวจสอบ URL ของ API endpoints
- ดู Console ในเบราว์เซอร์เพื่อหา JavaScript errors

#### 3. ฐานข้อมูลเสีย
```
Error: database is locked
```
**วิธีแก้:**
```bash
# ลบฐานข้อมูลและสร้างใหม่
rm jlktran.db
python app.py
```

### การตรวจสอบ Logs

```bash
# ดู logs ของ Flask
tail -f app.log

# หรือเปิด debug mode
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

## 📊 การจัดการข้อมูล

### ดูข้อมูลในฐานข้อมูล

```python
import sqlite3

# เชื่อมต่อฐานข้อมูล
conn = sqlite3.connect('jlktran.db')
cursor = conn.cursor()

# ดูคำขอใบเสนอราคา
cursor.execute("SELECT * FROM quotes ORDER BY created_at DESC LIMIT 10")
quotes = cursor.fetchall()

# ดูข้อความติดต่อ
cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10")
contacts = cursor.fetchall()

conn.close()
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | หน้าแรก |
| GET | `/contact.html` | หน้าติดต่อเรา |
| GET | `/quote.html` | หน้าขอใบเสนอราคา |
| POST | `/api/contact` | ส่งฟอร์มติดต่อ |
| POST | `/api/quote` | ส่งฟอร์มขอใบเสนอราคา |
| GET | `/api/quotes` | ดูคำขอทั้งหมด (admin) |
| POST | `/api/admin/test-email` | ทดสอบส่งอีเมล |
| GET | `/api/health` | ตรวจสอบสถานะเซิร์ฟเวอร์ |

## 🔒 ความปลอดภัย

### การตั้งค่าสำหรับ Production

1. **แก้ไข .env**
```env
FLASK_ENV=production
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-here
```

2. **ใช้ HTTPS**
```bash
# ใช้ Nginx หรือ Apache เป็น reverse proxy
# หรือใช้ Let's Encrypt สำหรับ SSL
```

3. **จำกัดการเข้าถึง Admin**
```python
# เพิ่ม authentication สำหรับ admin endpoints
# ใน app.py
```

## 📞 การติดต่อและสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:

- **อีเมล:** jlktransservice@gmail.com
- **โทรศัพท์:** 086-888-9745
- **เวลาทำการ:** จันทร์-ศุกร์ 8:00-17:30

---

## ✅ Checklist การตั้งค่า

- [ ] ติดตั้ง Python dependencies
- [ ] สร้าง Gmail App Password
- [ ] แก้ไขไฟล์ .env
- [ ] ทดสอบการส่งอีเมล
- [ ] ทดสอบฟอร์มทั้งสอง
- [ ] ตรวจสอบการรับอีเมลแจ้งเตือน
- [ ] ตั้งค่า production (ถ้าจำเป็น)

**ระบบพร้อมใช้งานแล้ว! 🎉**