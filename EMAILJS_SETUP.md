# EmailJS Setup Guide for Contact Form

## 📧 How to Set Up Email Functionality

Your contact form is now configured to send emails using **EmailJS** - a free service that handles form submissions without a backend server.

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### Step 2: Add Email Service

1. In your EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - Outlook
   - Yahoo
   - Or any other SMTP service
4. Follow the connection wizard
5. **Copy your Service ID** - you'll need this!

### Step 3: Create Email Template

1. Go to **"Email Templates"** in your dashboard
2. Click **"Create New Template"**
3. Use this template structure:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. In the template settings, set:
   - **To Email**: `rittick.2012@gmail.com` (your email)
   - **From Name**: `{{from_name}}`
   - **Reply To**: `{{from_email}}`
5. **Copy your Template ID**

### Step 4: Get Public Key

1. Go to **"Account"** > **"General"** in your EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. **Copy this key**

### Step 5: Update Your Code

Open `src/components/Contact/Contact.jsx` and replace these lines (around line 36-38):

```javascript
const serviceId = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const templateId = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
```

With your actual credentials:

```javascript
const serviceId = 'service_xxxxxxx'; // Your Service ID from Step 2
const templateId = 'template_yyyyyyy'; // Your Template ID from Step 3
const publicKey = 'zzzzzzzzzzzzzzzzz'; // Your Public Key from Step 4
```

### Step 6: Test Your Contact Form

1. Start your development server: `npm start`
2. Navigate to your Contact section
3. Fill out the form with test data
4. Click **"Send Message"**
5. Check your email inbox at `rittick.2012@gmail.com`

### 🎉 That's It!

Your contact form is now fully functional! Every submission will be sent directly to your email.

---

## 📝 Template Variables Reference

These variables are automatically filled from the contact form:

- `{{from_name}}` - Visitor's name
- `{{from_email}}` - Visitor's email (for replying)
- `{{subject}}` - Message subject
- `{{message}}` - Full message content
- `{{to_email}}` - Your email (rittick.2012@gmail.com)

---

## 🔧 Troubleshooting

### Problem: "Failed to send message"
**Solution**: 
- Check your EmailJS credentials (Service ID, Template ID, Public Key)
- Verify your email service is connected in EmailJS dashboard
- Check browser console for detailed error messages

### Problem: Emails not arriving
**Solution**:
- Check your spam/junk folder
- Verify the "To Email" is set correctly in your template
- Make sure your EmailJS service is active

### Problem: "Failed to send: 403 Forbidden"
**Solution**:
- Your public key might be incorrect
- Go to EmailJS dashboard > Account > General
- Copy the correct Public Key

---

## 💰 Pricing

EmailJS offers:
- **Free Plan**: 200 emails/month
- **Paid Plans**: Start at $15/month for more emails

The free plan is perfect for a portfolio website!

---

## 🔒 Security Note

The credentials in your code (Service ID, Template ID, Public Key) are meant to be public - they're safe to commit to GitHub. EmailJS uses these along with domain restrictions to prevent abuse.

For added security, you can:
1. Go to EmailJS dashboard > Security
2. Add allowed domains (e.g., `rubyet.info`, `localhost`)

---

## 🎮 Gaming Theme Bonus

Your contact form already has:
- ✅ Loading states while sending
- ✅ Success/error messages with emojis
- ✅ Form validation
- ✅ Disabled inputs during submission
- ✅ Auto-clear form on success
- ✅ Beautiful animations

Ready to receive quests from potential clients! 🚀
