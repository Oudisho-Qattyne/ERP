// modules/registry/locales.ts
import { ar as sharedAr } from '../shared/presentation/locales/ar';
import { en as sharedEn } from '../shared/presentation/locales/en';

// Import other module locales here
import { ar as hrAr } from '../hr/presentation/locales/ar';
import { en as hrEn } from '../hr/presentation/locales/en';
import { ar as usersAr } from '../users/presentation/locales/ar';
import { en as usersEn } from '../users/presentation/locales/en';

export const allLocales: Record<string, any> = {
  shared: { ar: sharedAr, en: sharedEn },
  hr: { ar: hrAr, en: hrEn },
  users: { ar: usersAr, en: usersEn },
  // Add new modules here:
  // crm: { ar: crmAr, en: crmEn },
};
