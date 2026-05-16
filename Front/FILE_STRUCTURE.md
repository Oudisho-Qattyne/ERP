# نظام المدينة الصناعية في حسياء — هيكل الملفات
# Hassia Industrial City ERP+CRM — File Structure

## بنية المشروع (Frontend Source Files)

```
src/
├── App.jsx                    # التطبيق الرئيسي — الهيكل العام، الشريط الجانبي، التوجيه
├── theme.js                   # الألوان، الخطوط، الثوابت، خرائط الحالات، أنواع الأقسام
├── styles.js                  # الأنماط المشتركة (cd, inp, bP, bS, bG)
├── data/
│   └── seedData.js            # البيانات التجريبية — مستثمرين، طلبات، عقود، فواتير، موظفين
├── components/
│   └── shared.jsx             # المكونات المشتركة:
│                              #   Bg (شارة الحالة), Rt (تصنيف), Em (فارغ)
│                              #   Fl (حقل), Tb/Tc (جدول), Mo (نافذة منبثقة)
│                              #   Ts (إشعار), SC (بطاقة إحصائية)
│                              #   Tabs, DocList, DocUpload, FIM (نموذج ذكي)
└── views/
    ├── Login.jsx              # صفحة تسجيل الدخول
    ├── Dashboard.jsx          # لوحة التحكم — KPIs، رسوم بيانية، آخر النشاطات
    ├── Investors.jsx          # ملفات المستثمرين — القائمة + الملف الشخصي 7 تبويبات
    ├── Requests.jsx           # الطلبات والمعاملات — سير العمل، التوقيع، SLA
    │                          #   يتضمن: RequestsView, ReqDetail, SignaturePad, SignatureDisplay
    ├── Contracts.jsx          # العقود — KPIs، تنبيهات الانتهاء، التفاصيل المالية
    ├── Invoices.jsx           # الفواتير والتحصيل — Aging، نسبة التحصيل، تفاصيل
    ├── Legal.jsx              # الشؤون القانونية — القضايا والنزاعات
    ├── HR.jsx                 # الموارد البشرية — الموظفين، الأقسام، الرواتب
    ├── Pipeline.jsx           # فرص الاستثمار — مراحل البيع
    ├── Interactions.jsx       # سجل التواصل — مكالمات، اجتماعات، زيارات
    ├── Plots.jsx              # الأراضي والمقاسم — المناطق والإشغال
    ├── Assets.jsx             # الأصول والبنية التحتية — صيانة ومتابعة
    ├── Reports.jsx            # التقارير — قطاعات، إشغال
    ├── Users.jsx              # المستخدمون (مدير فقط)
    ├── Notifications.jsx      # الإشعارات
    └── AuditLog.jsx           # سجل التدقيق (مدير فقط)
```

## كيف تعدّل ملف معين

### مشكلة في الطلبات وسير العمل؟
→ افتح `src/views/Requests.jsx`

### مشكلة في لوحة التحكم؟
→ افتح `src/views/Dashboard.jsx`

### تغيير الألوان أو الثوابت؟
→ افتح `src/theme.js`

### تعديل البيانات التجريبية؟
→ افتح `src/data/seedData.js`

### إضافة مكون جديد مشترك (زر، جدول، نافذة)؟
→ أضفه في `src/components/shared.jsx`

### إضافة قسم جديد كامل؟
1. أنشئ ملف في `src/views/NewModule.jsx`
2. أضف nav item في `src/theme.js` (مصفوفة NAV)
3. أضف case في `src/App.jsx` (renderPage)
4. أضف بيانات تجريبية في `src/data/seedData.js`

## ملاحظة مهمة

هذه الملفات هي النسخة المصدرية **المفككة** للتطوير.
النسخة التشغيلية هي الملف الموحد `hassia-erp.jsx` الذي يعمل مباشرة كـ artifact.
عند دمج الملفات للإنتاج، اجمع كل الملفات بالترتيب:
`theme.js` → `seedData.js` → `styles.js` → `shared.jsx` → `views/*.jsx` → `App.jsx`
