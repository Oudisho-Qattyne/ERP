// scripts/generate-nav.ts
import fs from 'fs';
import path from 'path';

const modulesDir = path.join(process.cwd(), 'modules');
const outputFile = path.join(modulesDir, 'generated', 'navigation.ts');

interface NavItem {
  id: string;
  label: string;
  icon: string;
  group: string;
  href: string;
  permission?: string;
}

interface NavGroup {
  id: string;
  label: string;
  order?: number;
}

interface ModuleConfig {
  hideSidebarPaths?: string[];
}

function scanModules() {
  const modules = fs.readdirSync(modulesDir).filter((file) => {
    const stat = fs.statSync(path.join(modulesDir, file));
    return stat.isDirectory() && !file.startsWith('_') && file !== 'generated';
  });

  const navItems: NavItem[] = [];
  const navGroups: NavGroup[] = [];
  const hideSidebarPaths: string[] = [];

  for (const moduleName of modules) {
    const navPath = path.join(modulesDir, moduleName, 'presentation', 'navigation.ts');
    if (!fs.existsSync(navPath)) continue;

    try {
      // Clear require cache to avoid stale data
      delete require.cache[require.resolve(navPath)];
      const moduleExports = require(navPath);
      
      if (moduleExports.navItems) {
        navItems.push(...moduleExports.navItems);
      }
      if (moduleExports.navGroups) {
        navGroups.push(...moduleExports.navGroups);
      }
      if (moduleExports.config?.hideSidebarPaths) {
        hideSidebarPaths.push(...moduleExports.config.hideSidebarPaths);
      }
    } catch (err) {
      console.warn(`Error loading navigation from ${moduleName}:`, err);
    }
  }

  // Generate output
  const outputContent = `// Auto-generated from modules/*/presentation/navigation.ts
// Do not edit manually. Changes will be overwritten.

export const navItems = ${JSON.stringify(navItems, null, 2)};

export const navGroups = ${JSON.stringify(navGroups, null, 2)};

export const hideSidebarPaths = ${JSON.stringify(hideSidebarPaths, null, 2)};

export function getAllNavItems() {
  return navItems;
}

export function getAllNavGroups() {
  return navGroups;
}

export function getHideSidebarPaths() {
  return hideSidebarPaths;
}
`;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, outputContent);
  console.log(`✅ Generated navigation registry at ${outputFile}`);
}

scanModules();