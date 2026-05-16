import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend } from "recharts";

/* ═══════════════════════════════════════════════════════════
   المدينة الصناعية في حسياء — نظام الإدارة الموحد
   Hassia Industrial City — Government ERP + CRM v2.0
   الجمهورية العربية السورية
   ═══════════════════════════════════════════════════════════ */

const F = "'Noto Sans Arabic','Tajawal',system-ui";
const dt = () => new Date().toISOString().slice(0,10);
const tm = () => new Date().toISOString().slice(0,16).replace("T"," ");
const rid = (p) => p + "-" + (Math.floor(Math.random()*9000)+1000);

// Color theme — Syrian government green/gold
const C = {
  green:"#1a6b3c", greenDark:"#0d4a28", greenLight:"#e8f5ec",
  gold:"#c9a84c", goldLight:"#faf6e8", goldDark:"#8a7233",
  bg:"#f2f4f3", card:"#fff", border:"#dce3dc",
  text:"#1a2e1a", muted:"#5a7060", light:"#8fa898",
  danger:"#b91c1c", warning:"#a16207", success:"#0f6e3a",
  navy:"#1a2e1a", white:"#fff",
};

// ════════════ MAPS ════════════
const DEPT={ishtitab:{l:"الاكتتاب",i:"📋",c:"#7c3aed"},investment:{l:"الاستثمار",i:"💼",c:"#059669"},legal:{l:"القانونية",i:"⚖️",c:"#dc2626"},technical:{l:"الفنية",i:"🔧",c:"#d97706"},finance:{l:"المالية",i:"🏦",c:"#0891b2"}};
const ST={"new":{l:"جديد",c:"#3b82f6",b:"#eff6ff"},in_review:{l:"قيد المراجعة",c:"#d97706",b:"#fffbeb"},pending:{l:"معلق",c:"#7c3aed",b:"#f5f3ff"},approved:{l:"معتمد",c:"#059669",b:"#ecfdf5"},rejected:{l:"مرفوض",c:"#dc2626",b:"#fef2f2"},completed:{l:"مكتمل",c:C.green,b:C.greenLight}};
const PR={low:{l:"منخفض",c:"#6b7280",b:"#f9fafb"},medium:{l:"متوسط",c:"#d97706",b:"#fffbeb"},high:{l:"عالي",c:"#dc2626",b:"#fef2f2"},urgent:{l:"عاجل",c:"#7c2d12",b:"#fff7ed"}};
const CS={draft:{l:"مسودة",c:"#6b7280",b:"#f3f4f6"},active:{l:"نشط",c:C.green,b:C.greenLight},expired:{l:"منتهي",c:"#dc2626",b:"#fef2f2"},renewal:{l:"تجديد",c:"#2563eb",b:"#eff6ff"},suspended:{l:"مجمد",c:"#7c2d12",b:"#fff7ed"}};
const IS={pending:{l:"معلقة",c:"#d97706",b:"#fffbeb"},paid:{l:"مدفوعة",c:C.green,b:C.greenLight},overdue:{l:"متأخرة",c:"#dc2626",b:"#fef2f2"}};
const LS={active:{l:"نشطة",c:"#2563eb",b:"#eff6ff"},awaiting:{l:"بانتظار",c:"#d97706",b:"#fffbeb"},closed:{l:"مغلقة",c:"#6b7280",b:"#f3f4f6"}};
const PS={lead:{l:"محتمل",c:"#94a3b8",b:"#f1f5f9"},qualified:{l:"مؤهل",c:"#3b82f6",b:"#eff6ff"},proposal:{l:"عرض",c:"#7c3aed",b:"#f5f3ff"},negotiation:{l:"تفاوض",c:"#d97706",b:"#fffbeb"},won:{l:"مكسوب",c:C.green,b:C.greenLight},lost:{l:"خاسر",c:"#dc2626",b:"#fef2f2"}};
const VS={active:{l:"نشط",c:C.green,b:C.greenLight},prospect:{l:"محتمل",c:"#3b82f6",b:"#eff6ff"},suspended:{l:"موقوف",c:"#dc2626",b:"#fef2f2"},inactive:{l:"غير نشط",c:"#6b7280",b:"#f3f4f6"}};
const PLS={available:{l:"متاح",c:C.green,b:C.greenLight},allocated:{l:"مخصص",c:"#3b82f6",b:"#eff6ff"},reserved:{l:"محجوز",c:"#d97706",b:"#fffbeb"},maintenance:{l:"صيانة",c:"#d97706",b:"#fff7ed"},suspended:{l:"مجمد",c:"#dc2626",b:"#fef2f2"}};
const AS={operational:{l:"يعمل",c:C.green,b:C.greenLight},maintenance:{l:"صيانة",c:"#d97706",b:"#fffbeb"},decommissioned:{l:"خارج الخدمة",c:"#dc2626",b:"#fef2f2"}};
const CMP={compliant:{l:"ملتزم",c:C.green,b:C.greenLight},warning:{l:"تحذير",c:"#d97706",b:"#fffbeb"},violation:{l:"مخالفة",c:"#dc2626",b:"#fef2f2"}};
const IT={call:{l:"مكالمة",i:"📞",c:"#3b82f6"},meeting:{l:"اجتماع",i:"🤝",c:C.green},email:{l:"بريد",i:"📧",c:"#7c3aed"},visit:{l:"زيارة ميدانية",i:"🏭",c:"#d97706"},note:{l:"ملاحظة",i:"📝",c:"#6b7280"}};
const RTYP=[{v:"subscription",l:"اكتتاب"},{v:"license",l:"ترخيص"},{v:"contract",l:"عقد"},{v:"complaint",l:"شكوى"},{v:"payment",l:"سداد"},{v:"maintenance",l:"صيانة"}];
const CTYP=[{v:"land_lease",l:"إيجار أرض"},{v:"investment",l:"استثماري"},{v:"license",l:"ترخيص"},{v:"service",l:"خدمات"}];
const ITYP=[{v:"annual_fee",l:"رسوم سنوية"},{v:"license_fee",l:"رسوم ترخيص"},{v:"subscription_fee",l:"رسوم اكتتاب"},{v:"penalty",l:"غرامة"}];
const LTYP=[{v:"dispute",l:"نزاع"},{v:"contract_breach",l:"إخلال عقد"},{v:"complaint",l:"شكوى"},{v:"review",l:"مراجعة"}];
const HRS={active:{l:"على رأس العمل",c:C.green,b:C.greenLight},on_leave:{l:"في إجازة",c:"#d97706",b:"#fffbeb"},suspended:{l:"موقوف",c:"#dc2626",b:"#fef2f2"},terminated:{l:"منتهي الخدمة",c:"#6b7280",b:"#f3f4f6"}};
const ETYP=[{v:"permanent",l:"دائم"},{v:"contract",l:"عقد مؤقت"},{v:"parttime",l:"دوام جزئي"},{v:"intern",l:"متدرب"}];
const ROLES={admin:"المدير العام",manager:"مدير قسم",staff:"موظف"};
const CC=["#1a6b3c","#1e3a5f","#d97706","#dc2626","#7c3aed","#0891b2","#be185d","#4f46e5"];
const fmtSYP = (v) => { if (!v && v!==0) return "—"; if (v>=1e9) return (v/1e9).toFixed(1)+" مليار"; if (v>=1e6) return (v/1e6).toFixed(1)+" مليون"; return v.toLocaleString(); };

const NAV=[
  {id:"dashboard",l:"لوحة التحكم",i:"📊",g:"main"},
  {id:"requests",l:"الطلبات والمعاملات",i:"📨",g:"erp"},
  {id:"contracts",l:"العقود",i:"📄",g:"erp"},
  {id:"invoices",l:"الفواتير والتحصيل",i:"🏦",g:"erp"},
  {id:"legal",l:"الشؤون القانونية",i:"⚖️",g:"erp"},
  {id:"hr",l:"الموارد البشرية",i:"🧑‍💼",g:"erp"},
  {id:"investors",l:"ملفات المستثمرين",i:"🏢",g:"crm"},
  {id:"pipeline",l:"فرص الاستثمار",i:"📈",g:"crm"},
  {id:"interactions",l:"سجل التواصل",i:"💬",g:"crm"},
  {id:"plots",l:"الأراضي والمقاسم",i:"🗺️",g:"asset"},
  {id:"assets",l:"الأصول والبنية التحتية",i:"🏗️",g:"asset"},
  {id:"reports",l:"التقارير",i:"📉",g:"rpt"},
  {id:"users",l:"المستخدمون",i:"👥",g:"adm"},
  {id:"notifications",l:"الإشعارات",i:"🔔",g:"adm"},
  {id:"audit",l:"سجل التدقيق",i:"📝",g:"adm"},
];
const NG=[{id:"main",l:""},{id:"erp",l:"إدارة العمليات"},{id:"crm",l:"إدارة علاقات المستثمرين"},{id:"asset",l:"الأصول والأراضي"},{id:"rpt",l:"التحليلات"},{id:"adm",l:"الإدارة"}];
