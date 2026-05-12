'use client';
import { notFound } from 'next/navigation';
import React from 'react';

export interface RouteConfig {
  path: string;          // e.g., '', 'create', ':id', ':id/edit'
  component: React.ComponentType<any>;
  exact?: boolean;
}

interface ModuleRouterProps {
  routes: RouteConfig[];
  subPath: string[];
  notFoundComponent?: React.ComponentType;
}

export default function ModuleRouter({ routes, subPath, notFoundComponent: NotFound }: ModuleRouterProps) {
  const matchRoute = () => {
    for (const route of routes) {
      const patternParts = route.path.split('/').filter(p => p);
      const subPathParts = subPath.filter(p => p);

      if (route.exact && subPathParts.length !== patternParts.length) continue;
      if (patternParts.length > subPathParts.length) continue;

      let matched = true;
      const params: Record<string, string> = {};

      for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const subPart = subPathParts[i];
        if (patternPart.startsWith(':')) {
          params[patternPart.slice(1)] = subPart;
        } else if (patternPart !== subPart) {
          matched = false;
          break;
        }
      }
      if (matched) return { Component: route.component, params };
    }
    return null;
  };

  const matched = matchRoute();
  if (!matched) {
    notFound()
  }

  const { Component, params } = matched;
  // Spread params as props, and also pass full subPath
  return <Component {...params} subPath={subPath} />;
}