// src/app/login/page.tsx (or src/pages/login.tsx)
'use client';


import { Button } from '@/src/modules/shared/presentation/components/ui/buttons/Button';
import { Input } from '@/src/modules/shared/presentation/components/ui/inputs/Input.tsx';
import { useDynamicForm } from '@/src/modules/shared/presentation/hooks/useDynamicForm';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { fieldProps, handleSubmit, isValid, isSubmitting } = useDynamicForm<LoginFormData>({
    schema: loginSchema,
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormData) => {
    // Replace with your actual authentication logic
    console.log('Login attempt:', data);
    // Example: call your API, context, etc.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-dark via-primary to-primary-dark relative">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-conic-gradient(#fff_0%_25%,transparent_0%_50%)] bg-size-[40px_40px] pointer-events-none" />
      
      <div className="bg-card rounded-2xl p-10 w-100 shadow-2xl border-t-4 border-gold relative z-10">
        <div className="text-center mb-8">
          {/* Eagle emblem */}
          <div className="w-16 h-16 rounded-xl mx-auto mb-4 bg-linear-to-br from-gold to-gold-dark flex items-center justify-center text-3xl font-black text-primary-dark shadow-lg shadow-gold/30">
            🦅
          </div>
          <h1 className="text-xl font-extrabold text-text">المدينة الصناعية في حسياء</h1>
          <p className="text-sm text-text-muted mt-1">نظام الإدارة الموحد — ERP + CRM</p>
          <p className="text-xs text-text-light mt-1">الجمهورية العربية السورية — محافظة حمص</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...fieldProps('username')}
            label="اسم المستخدم"
            placeholder="admin"
          />
          <Input
            {...fieldProps('password')}
            type="password"
            label="كلمة المرور"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="gold"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            disabled={!isValid}
          >
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </div>
  );
}