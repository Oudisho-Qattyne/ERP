'use client';

import React from 'react';
import { WelcomeBanner } from '../../../shared/presentation/components/ui/layout/WelcomeBanner';
import { StatCard } from '../../../shared/presentation/components/ui/statistics/StatCard';
import { DistributionCard } from '../../../shared/presentation/components/ui/statistics/DistributionCard';
import { OccupancyCard } from '../../../shared/presentation/components/ui/statistics/OccupancyCard';
import { Badge } from '../../../shared/presentation/components/ui/badges/Badge';
import { useLanguage } from '../../../shared/presentation/context/LanguageContext';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';

export function DashboardPage() {
  const { t } = useLanguage();
  const bannerStats: any[] = [
    { label: 'مستثمر نشط', value: '42', variant: 'warning' },
    { label: 'نسبة الإشغال', value: '78%', variant: 'white' },
    { label: 'فواتير متأخرة', value: '12', variant: 'danger' },
  ];

  const distributionItems = [
    { label: 'قسم الهندسة', value: 24, total: 50, color: 'var(--color-primary)', icon: '🏗️' },
    { label: 'قسم المالية', value: 12, total: 50, color: 'var(--color-success)', icon: '💰' },
    { label: 'قسم القانونية', value: 8, total: 50, color: 'var(--color-warning)', icon: '⚖️' },
    { label: 'قسم البيئة', value: 6, total: 50, color: 'var(--color-danger)', icon: '🌿' },
  ];

  const sectorItems = [
    { label: 'القطاع الغذائي', value: 15, total: 42, color: '#f59e0b' },
    { label: 'القطاع الكيميائي', value: 10, total: 42, color: '#3b82f6' },
    { label: 'القطاع الهندسي', value: 8, total: 42, color: '#10b981' },
    { label: 'القطاع النسيجي', value: 9, total: 42, color: '#8b5cf6' },
  ];

  const occupancyItems = [
    { label: 'المنطقة A', value: 8, total: 10 },
    { label: 'المنطقة B', value: 15, total: 20 },
    { label: 'المنطقة C', value: 5, total: 12 },
    { label: 'المنطقة D', value: 18, total: 20 },
    { label: 'المنطقة E', value: 2, total: 10 },
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in pb-20">
      {/* Header with Badges */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">{t('dashboard.title', 'hr')}</h1>
          <p className="text-text-muted mt-1">{t('dashboard.welcome', 'hr')}</p>
        </div>
        <div className="flex gap-2">
          <Badge label="النظام مستقر" variant="success" pulse />
          <Badge label="تحديث مباشر" variant="primary" />
        </div>
      </div>

      {/* Hero Section */}
      <WelcomeBanner 
        title="المدينة الصناعية في حسياء" 
        subtitle="محافظة حمص — نظام الإدارة الموحد" 
        stats={bannerStats} 
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Users size={20} />} 
          label="إجمالي الموظفين" 
          value="1,248" 
          subLabel="24 طلب توظيف جديد"
          trend={{ value: '12%', isUp: true }}
          priority
        />
        <StatCard 
          icon={<FileText size={20} />} 
          label="الطلبات النشطة" 
          value="85" 
          subLabel="15 طلب بانتظار المراجعة"
          trend={{ value: '5%', isUp: false }}
        />
        <StatCard 
          icon={<TrendingUp size={20} />} 
          label="القيمة المتوقعة" 
          value="2.5M" 
          subLabel="ليرة سورية"
          trend={{ value: '18%', isUp: true }}
        />
        <StatCard 
          icon={<AlertTriangle size={20} />} 
          label="تنبيهات النظام" 
          value="3" 
          subLabel="تتطلب تدخل فوري"
          trend={{ value: '2', isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution & Workload */}
        <DistributionCard title="حمولة العمل حسب القسم" items={distributionItems} />
        <DistributionCard title="توزيع المستثمرين حسب القطاع" items={sectorItems} />
      </div>

      {/* Occupancy Section */}
      <OccupancyCard title="إشغال المناطق الصناعية" items={occupancyItems} />

      {/* Recent Activity List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-black text-text tracking-tight">آخر الطلبات المستلمة</h4>
            <button className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors">عرض الكل</button>
          </div>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-primary-light/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">طلب ترخيص منشأة صناعية</div>
                    <div className="text-[10px] text-text-muted mt-0.5">شركة المتحدون • REF: #HS-2024-{i}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge 
                    label={i % 2 === 0 ? 'قيد المراجعة' : 'مكتمل'} 
                    variant={i % 2 === 0 ? 'warning' : 'success'} 
                  />
                  <span className="text-[9px] text-text-muted opacity-50 font-medium">منذ {i} ساعات</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
          <h4 className="text-lg font-black text-text tracking-tight mb-6">التنبيهات العاجلة</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/10 border-r-4 border-r-danger">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-danger shrink-0" size={18} />
                <div>
                  <div className="text-xs font-bold text-danger mb-1">فواتير متأخرة</div>
                  <p className="text-[10px] text-text-muted leading-relaxed">هناك 12 فاتورة تجاوزت موعد الاستحقاق بأكثر من 30 يوماً.</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/10 border-r-4 border-r-warning">
              <div className="flex items-start gap-3">
                <Clock className="text-warning shrink-0" size={18} />
                <div>
                  <div className="text-xs font-bold text-warning mb-1">تجديد عقود</div>
                  <p className="text-[10px] text-text-muted leading-relaxed">تنتهي صلاحية 5 عقود إيجار خلال الأسبوع القادم.</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 border-r-4 border-r-primary">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-primary shrink-0" size={18} />
                <div>
                  <div className="text-xs font-bold text-primary mb-1">اكتمال المزامنة</div>
                  <p className="text-[10px] text-text-muted leading-relaxed">تمت مزامنة جميع البيانات مع الخادم الرئيسي بنجاح.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
