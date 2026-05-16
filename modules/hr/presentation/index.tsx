'use client';

import React from 'react';
import ModuleRouter from '../../shared/presentation/ModuleRouter';
import { hrRoutes } from './routes';

interface HRModuleProps {
  subPath?: string[];
}

export default function HRModule({ subPath = [] }: HRModuleProps) {
  return (
    <div className="hr-module-container">
      <ModuleRouter 
        routes={hrRoutes} 
        subPath={subPath} 
      />
    </div>
  );
}
