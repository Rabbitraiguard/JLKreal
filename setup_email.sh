#!/bin/bash

# JLK Transservice - Email Setup Script
# สคริปต์ช่วยตั้งค่าระบบอีเมลและเริ่มใช้งาน

echo "🚀 JLK Transservice - Email Setup Script"
echo "=========================================="

# ตรวจสอบไฟล์ที่จำเป็น
echo "📋 ตรวจสอบไฟล์..."
if [ ! -f "app.py" ]; then
    echo "❌ ไม่พบไฟล์ app.py"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "❌ ไม่พบไฟล์ .env"
    echo "💡 กรุณาคัดลอกไฟล์ .env.example เป็น .env และแก้ไขการตั้งค่า"
    exit 1
fi

echo "✅ ไฟล์ครบถ้วน"

# ตรวจสอบ Python dependencies
echo ""
echo "🔧 ตรวจสอบ Python dependencies..."
python3 -c "import flask, flask_cors, dotenv" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 ติดตั้ง dependencies..."
    python3 -m pip install --break-system-packages -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ ติดตั้ง dependencies ไม่สำเร็จ"
        exit 1
    fi
fi
echo "✅ Dependencies พร้อมใช้งาน"

# ตรวจสอบการตั้งค่าอีเมล
echo ""
echo "📧 ตรวจสอบการตั้งค่าอีเมล..."
if grep -q "your-gmail-app-password-here" .env; then
    echo "⚠️  ยังไม่ได้ตั้งค่า EMAIL_PASSWORD ในไฟล์ .env"
    echo ""
    echo "📝 วิธีตั้งค่า Gmail App Password:"
    echo "1. ไปที่ https://myaccount.google.com/"
    echo "2. Security > 2-Step Verification (เปิดใช้งานก่อน)"
    echo "3. Security > App passwords"
    echo "4. เลือก Mail > Other > ตั้งชื่อ 'JLK Transservice'"
    echo "5. คัดลอก password ที่ได้ไปใส่ในไฟล์ .env"
    echo ""
    echo "🔧 แก้ไขไฟล์ .env:"
    echo "   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx"
    echo ""
    read -p "กด Enter เมื่อแก้ไขเสร็จแล้ว..."
fi

# ทดสอบเซิร์ฟเวอร์
echo ""
echo "🚀 เริ่มเซิร์ฟเวอร์..."
python3 app.py &
SERVER_PID=$!

# รอให้เซิร์ฟเวอร์เริ่มต้น
sleep 5

# ทดสอบ health check
echo "🔍 ทดสอบเซิร์ฟเวอร์..."
HEALTH_CHECK=$(curl -s http://localhost:5000/api/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ เซิร์ฟเวอร์ทำงานปกติ"
    echo "🌐 เว็บไซต์: http://localhost:5000"
    echo "📋 API Health: http://localhost:5000/api/health"
else
    echo "❌ เซิร์ฟเวอร์ไม่ตอบสนอง"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# ทดสอบการส่งอีเมล (ถ้าตั้งค่าแล้ว)
echo ""
echo "📧 ทดสอบการส่งอีเมล..."
if ! grep -q "your-gmail-app-password-here" .env; then
    echo "📤 ส่งอีเมลทดสอบ..."
    EMAIL_TEST=$(curl -s -X POST http://localhost:5000/api/admin/test-email \
        -H "Content-Type: application/json" \
        -d '{"email": "jlktransservice@gmail.com"}' 2>/dev/null)
    
    if echo "$EMAIL_TEST" | grep -q "success.*true"; then
        echo "✅ ส่งอีเมลทดสอบสำเร็จ"
    else
        echo "⚠️  การส่งอีเมลมีปัญหา - ตรวจสอบการตั้งค่า EMAIL_PASSWORD"
    fi
else
    echo "⏭️  ข้ามการทดสอบอีเมล (ยังไม่ได้ตั้งค่า)"
fi

echo ""
echo "🎉 ระบบพร้อมใช้งาน!"
echo "================================"
echo "📱 หน้าเว็บไซต์:"
echo "   • หน้าแรก: http://localhost:5000"
echo "   • ขอใบเสนอราคา: http://localhost:5000/quote.html"
echo "   • ติดต่อเรา: http://localhost:5000/contact.html"
echo ""
echo "🔧 API Endpoints:"
echo "   • Health Check: http://localhost:5000/api/health"
echo "   • ส่งฟอร์มติดต่อ: POST /api/contact"
echo "   • ส่งฟอร์มขอราคา: POST /api/quote"
echo "   • ดูคำขอทั้งหมด: GET /api/quotes"
echo ""
echo "📖 อ่านคู่มือเพิ่มเติม: EMAIL_SETUP_GUIDE.md"
echo ""
echo "🛑 หยุดเซิร์ฟเวอร์: kill $SERVER_PID"
echo ""

# เก็บ PID ไว้ในไฟล์
echo $SERVER_PID > server.pid
echo "💾 Server PID: $SERVER_PID (บันทึกใน server.pid)"

wait $SERVER_PID