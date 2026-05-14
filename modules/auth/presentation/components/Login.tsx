'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/modules/shared/presentation/components/ui/buttons/Button';
import { Input } from '@/modules/shared/presentation/components/ui/inputs/Input.tsx';
import { useDynamicForm } from '@/modules/shared/presentation/hooks/useDynamicForm';

import { useAuth } from '../hooks/useAuth';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح').min(1, 'البريد الإلكتروني مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: isLoginLoading, error: authError } = useAuth();

  const { fieldProps, handleSubmit, isValid, isSubmitting, form } = useDynamicForm<LoginFormData>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // Redirect to home or dashboard after successful login
      router.push('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.validationErrors) {
        Object.keys(err.validationErrors).forEach((key) => {
          const messages = err.validationErrors[key];
          const message = Array.isArray(messages) ? messages[0] : messages;
          form.setError(key as keyof LoginFormData, { type: 'server', message });
        });
      }
    }
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

        {authError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...fieldProps('email')}
            type="email"
            label="البريد الإلكتروني"
            placeholder="admin@example.com"
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
            isLoading={isSubmitting || isLoginLoading}
            disabled={!isValid}
          >
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </div>
  );
}
