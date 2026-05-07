// src/components/ui/Tb.tsx
import React from 'react';

interface TbProps {
  children: React.ReactNode;
}

export function Tb({ children }: TbProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rtl:text-right ltr:text-left">
        {children}
      </table>
    </div>
  );
}