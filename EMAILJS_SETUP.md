# EmailJS Setup Guide for JLK Transservice

## Overview
This guide will help you set up EmailJS to replace Formspree for handling form submissions in the JLK Transservice website.

## Required Configuration

### 1. EmailJS Account Setup
- Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
- Create an account or log in
- Your Public Key is already configured: `MQj01V11zBf3edqLX`

### 2. Email Service Setup
You need to create an email service in EmailJS dashboard:

1. Go to **Email Services** section
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Set Service ID as: `default_service`
5. Connect your Gmail account (jlktransservice@gmail.com)

### 3. Email Templates Setup

#### Template 1: Contact Form Template
1. Go to **Email Templates** section
2. Click **Create New Template**
3. Set Template ID as: `template_contact`
4. Template Name: "Contact Form - JLK Transservice"

**Template Content:**
```
Subject: ข้อความใหม่จากเว็บไซต์ - {{subject}}

เรียน ทีมงาน JLK Transservice,

มีข้อความใหม่จากเว็บไซต์:

ชื่อผู้ติดต่อ: {{from_name}}
อีเมล: {{from_email}}
หัวข้อ: {{subject}}

ข้อความ:
{{message}}

---
ข้อความนี้ส่งมาจากแบบฟอร์มติดต่อบนเว็บไซต์ JLK Transservice
กรุณาตอบกลับไปที่: {{reply_to}}
```

**Settings:**
- To Email: jlktransservice@gmail.com
- From Name: {{from_name}}
- Reply-To: {{reply_to}}

#### Template 2: Quote Request Template
1. Create another template
2. Set Template ID as: `template_quote`
3. Template Name: "Quote Request - JLK Transservice"

**Template Content:**
```
Subject: คำขอใบเสนอราคาใหม่ - {{company_name}}

เรียน ทีมงาน JLK Transservice,

มีคำขอใบเสนอราคาใหม่จากเว็บไซต์:

ข้อมูลบริษัท:
- ชื่อบริษัท: {{company_name}}
- ผู้ติดต่อ: {{contact_name}}
- อีเมล: {{from_email}}
- เบอร์โทรศัพท์: {{phone}}

รายละเอียดการขนส่ง:
- ประเภทบริการ: {{service_type}}
- ประเภทสินค้า: {{cargo_type}}
- จุดรับสินค้า: {{origin}}
- จุดส่งสินค้า: {{destination}}
- น้ำหนัก: {{weight}}
- ปริมาตร: {{volume}}
- วันที่รับสินค้า: {{pickup_date}}

ความต้องการพิเศษ: {{special_requirements}}
หมายเหตุเพิ่มเติม: {{additional_notes}}

---
คำขอนี้ส่งมาจากแบบฟอร์มขอใบเสนอราคาบนเว็บไซต์ JLK Transservice
กรุณาตอบกลับไปที่: {{reply_to}}
```

**Settings:**
- To Email: jlktransservice@gmail.com
- From Name: {{contact_name}} ({{company_name}})
- Reply-To: {{reply_to}}

### 4. Update Configuration (if needed)
If you use different Service ID or Template IDs, update them in `static/js/emailjs-handler.js`:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'MQj01V11zBf3edqLX',
    privateKey: 'OtbWFwTYDuv3AZHk2-pdm',
    serviceId: 'your_service_id', // Update this
    contactTemplateId: 'your_contact_template_id', // Update this
    quoteTemplateId: 'your_quote_template_id' // Update this
};
```

### 5. Testing
1. Deploy the updated website
2. Test the contact form at `/contact.html`
3. Test the quote form at `/quote.html`
4. Check if emails are received at jlktransservice@gmail.com

### 6. Security Notes
- The Public Key (`MQj01V11zBf3edqLX`) is safe to expose in client-side code
- The Private Key should only be used server-side (currently not needed for this implementation)
- EmailJS automatically handles rate limiting and spam protection

## Migration from Formspree

### What Changed:
1. **Removed Formspree endpoints** - No longer using `https://formspree.io/f/mzzvaepv`
2. **Added EmailJS CDN** - Included EmailJS library in both HTML files
3. **New JavaScript handler** - Created `emailjs-handler.js` for form submissions
4. **Updated form behavior** - Forms now submit via JavaScript instead of direct POST

### Benefits:
- Better control over email templates
- Real-time form validation
- Improved user feedback
- No dependency on third-party form endpoints
- Customizable email formatting

## Troubleshooting

### Common Issues:
1. **Emails not sending**: Check if EmailJS service is properly connected
2. **Template errors**: Verify template IDs match configuration
3. **Authentication errors**: Ensure Gmail account is properly connected
4. **Rate limiting**: EmailJS free plan has sending limits

### Debug Mode:
Check browser console for error messages. The system logs all EmailJS responses for debugging.

## Support
For EmailJS specific issues, visit [EmailJS Documentation](https://www.emailjs.com/docs/)