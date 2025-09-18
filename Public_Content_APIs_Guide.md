# 🌐 دليل Public Content APIs

## 🎯 الهدف
تم حل مشكلة **403 Forbidden** من خلال إنشاء APIs عامة للمحتوى الذي يحتاجه الموقع بدون authentication.

---

## ✅ المشكلة والحل

### ❌ المشكلة السابقة:
- صفحات Footer, About Us, Contact تحاول الوصول لـ `/api/v1/admin/` 
- هذه الـ APIs تتطلب Admin Authentication
- النتيجة: **403 Forbidden**

### ✅ الحل الجديد:
- إنشاء **Public APIs** منفصلة تحت `/api/v1/public/`
- لا تحتاج authentication أو headers خاصة
- وصول مباشر للمحتوى العام

---

## 📋 قائمة Public APIs الجاهزة

| API Endpoint | الغرض | البيانات |
|-------------|-------|---------|
| `GET /api/v1/public/company-info` | معلومات الشركة | اسم الشركة، الوصف، الرؤية، الرسالة |
| `GET /api/v1/public/company-stats` | الإحصائيات | سنوات الخبرة، العملاء، المشاريع |
| `GET /api/v1/public/contact-info` | معلومات الاتصال | الهواتف، الإيميلات، العنوان، أوقات العمل |
| `GET /api/v1/public/social-links` | روابط التواصل | Facebook, Twitter, LinkedIn, Instagram, etc |
| `GET /api/v1/public/page-content` | محتوى الصفحات | نصوص About Us و Contact |
| `GET /api/v1/public/company-values` | قيم الشركة | الجودة، الدعم، الابتكار، الموثوقية |
| `GET /api/v1/public/company-milestones` | المعالم التاريخية | تاريخ الشركة من 2009-2024 |
| `GET /api/v1/public/company-story` | قصة الشركة | 3 فقرات + مميزات |
| `GET /api/v1/public/team-members` | أعضاء الفريق | 4 أعضاء مع التفاصيل |
| `GET /api/v1/public/departments` | الأقسام | 4 أقسام مع معلومات الاتصال |
| `GET /api/v1/public/faqs` | الأسئلة الشائعة | 6 أسئلة حقيقية مع الإجابات |
| `GET /api/v1/public/certifications` | الشهادات | ISO 9001، OSHA، شريك معتمد |

---

## 🚀 أمثلة الاستخدام

### 1️⃣ جلب معلومات الشركة
```javascript
// لصفحة About Us
const getCompanyInfo = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/public/company-info');
    const data = await response.json();
    
    if (data.success) {
      console.log(data.data.company_name); // "BS Tools"
      console.log(data.data.mission); // نص الرسالة
      console.log(data.data.vision); // نص الرؤية
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2️⃣ جلب معلومات الاتصال
```javascript
// للـ Footer وصفحة Contact
const getContactInfo = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/public/contact-info');
    const data = await response.json();
    
    if (data.success) {
      console.log(data.data.main_phone); // "+20 123 456 7890"
      console.log(data.data.main_email); // "info@bstools.com"
      console.log(data.data.address_street); // "شارع التحرير، المعادي"
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3️⃣ جلب الروابط الاجتماعية
```javascript
// للـ Footer
const getSocialLinks = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/public/social-links');
    const data = await response.json();
    
    if (data.success) {
      data.data.forEach(link => {
        console.log(`${link.platform}: ${link.url}`);
        // Facebook: https://facebook.com/bstools
        // Twitter: https://twitter.com/bstools
        // etc...
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 4️⃣ جلب محتوى الصفحات
```javascript
// لصفحات About Us و Contact
const getPageContent = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/public/page-content');
    const data = await response.json();
    
    if (data.success) {
      // محتوى صفحة About Us
      console.log(data.data.about_page.title_ar); // "نبني المستقبل معاً"
      console.log(data.data.about_page.subtitle_ar); // الوصف
      
      // محتوى صفحة Contact
      console.log(data.data.contact_page.title_ar); // "اتصل بنا"
      console.log(data.data.contact_page.subtitle_ar); // الوصف
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 5️⃣ جلب الإحصائيات
```javascript
// لصفحة About Us (Statistics Section)
const getCompanyStats = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/public/company-stats');
    const data = await response.json();
    
    if (data.success) {
      console.log(data.data.years_experience); // "15+"
      console.log(data.data.total_customers); // "50K+"
      console.log(data.data.completed_projects); // "1000+"
      console.log(data.data.support_availability); // "24/7"
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎨 React Component Examples

### Footer Component
```jsx
import { useState, useEffect } from 'react';

const Footer = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  
  useEffect(() => {
    // جلب معلومات الاتصال
    fetch('http://localhost:8000/api/v1/public/contact-info')
      .then(res => res.json())
      .then(data => {
        if (data.success) setContactInfo(data.data);
      });
    
    // جلب الروابط الاجتماعية
    fetch('http://localhost:8000/api/v1/public/social-links')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSocialLinks(data.data);
      });
  }, []);

  return (
    <footer>
      {contactInfo && (
        <div>
          <p>📞 {contactInfo.main_phone}</p>
          <p>📧 {contactInfo.main_email}</p>
          <p>📍 {contactInfo.address_street}</p>
        </div>
      )}
      
      <div className="social-links">
        {socialLinks.map(link => (
          <a key={link.id} href={link.url} target="_blank">
            {link.icon} {link.platform}
          </a>
        ))}
      </div>
    </footer>
  );
};
```

### About Us Page
```jsx
import { useState, useEffect } from 'react';

const AboutUsPage = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [companyStory, setCompanyStory] = useState(null);
  const [companyValues, setCompanyValues] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    // جلب جميع البيانات
    const fetchData = async () => {
      try {
        const [infoRes, statsRes, storyRes, valuesRes, milestonesRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/public/company-info'),
          fetch('http://localhost:8000/api/v1/public/company-stats'),
          fetch('http://localhost:8000/api/v1/public/company-story'),
          fetch('http://localhost:8000/api/v1/public/company-values'),
          fetch('http://localhost:8000/api/v1/public/company-milestones')
        ]);

        const [info, stats, story, values, milestones] = await Promise.all([
          infoRes.json(), statsRes.json(), storyRes.json(), valuesRes.json(), milestonesRes.json()
        ]);

        if (info.success) setCompanyInfo(info.data);
        if (stats.success) setCompanyStats(stats.data);
        if (story.success) setCompanyStory(story.data);
        if (values.success) setCompanyValues(values.data);
        if (milestones.success) setMilestones(milestones.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="about-us">
      {/* Company Info Section */}
      {companyInfo && (
        <section>
          <h1>{companyInfo.company_name}</h1>
          <p>{companyInfo.company_description}</p>
          <div>
            <h3>رسالتنا</h3>
            <p>{companyInfo.mission}</p>
          </div>
          <div>
            <h3>رؤيتنا</h3>
            <p>{companyInfo.vision}</p>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      {companyStats && (
        <section className="stats">
          <div>
            <h4>{companyStats.years_experience}</h4>
            <p>سنوات خبرة</p>
          </div>
          <div>
            <h4>{companyStats.total_customers}</h4>
            <p>عميل سعيد</p>
          </div>
          <div>
            <h4>{companyStats.completed_projects}</h4>
            <p>مشروع مكتمل</p>
          </div>
        </section>
      )}

      {/* Company Story Section */}
      {companyStory && (
        <section className="story">
          <h2>قصتنا</h2>
          <p>{companyStory.paragraph1_ar}</p>
          <p>{companyStory.paragraph2_ar}</p>
          <p>{companyStory.paragraph3_ar}</p>
        </section>
      )}

      {/* Company Values Section */}
      <section className="values">
        <h2>قيمنا</h2>
        <div className="values-grid">
          {companyValues.map(value => (
            <div key={value.id} className="value-card">
              <span className="icon">{value.icon}</span>
              <h3>{value.title_ar}</h3>
              <p>{value.description_ar}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="milestones">
        <h2>رحلتنا</h2>
        <div className="timeline">
          {milestones.map(milestone => (
            <div key={milestone.id} className="milestone">
              <div className="year">{milestone.year}</div>
              <div>
                <h4>{milestone.event_ar}</h4>
                <p>{milestone.description_ar}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
```

---

## 🔒 الفرق بين Admin و Public APIs

### 🔴 Admin APIs (تحتاج Authentication)
```javascript
// ❌ يحتاج Token
const response = await fetch('/api/v1/admin/company-info', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
    'Accept': 'application/json'
  }
});
```

### 🟢 Public APIs (لا تحتاج Authentication)
```javascript
// ✅ مباشرة بدون headers
const response = await fetch('/api/v1/public/company-info');
```

---

## 📝 Response Format

جميع الـ Public APIs ترجع بنفس التنسيق:

```json
{
  "success": true,
  "data": {
    // البيانات المطلوبة
  }
}
```

### مثال Response - Company Info:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "BS Tools",
    "company_description": "شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً",
    "mission": "نسعى لتوفير أفضل أدوات ومواد البناء...",
    "vision": "أن نكون الشركة الرائدة في منطقة الشرق الأوسط...",
    "logo_text": "BS",
    "founded_year": "2009",
    "employees_count": "150+"
  }
}
```

---

## 🎉 الخلاصة

### ✅ ما تم حله:
- ❌ مشكلة 403 Forbidden → ✅ محلولة
- ❌ صعوبة الوصول للمحتوى → ✅ APIs عامة متاحة
- ❌ خلط بين الإدارة والعرض → ✅ فصل واضح

### 🚀 ما أصبح متاحاً:
- **10 Public APIs** جاهزة للاستخدام
- **لا تحتاج authentication**
- **بيانات حقيقية كاملة لشركة BS Tools**
- **سهولة التكامل مع أي Frontend Framework**

### 🎯 التوصية:
استخدم **Public APIs** للمحتوى العام (Footer, About, Contact) و **Admin APIs** لإدارة المحتوى في Dashboard.

---

**🔥 المشكلة حُلت نهائياً! الآن يمكن للفرونت إند الوصول لجميع البيانات بدون أي مشاكل authentication.** 