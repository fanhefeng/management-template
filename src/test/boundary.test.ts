import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * 架构防腐守卫（样式层）。
 *
 * .oxlintrc 的 no-restricted-imports 只能拦住「直接 import HeroUI」，拦不住 HeroUI 专有的
 * Tailwind 语义类（bg-content1 / text-default-* / text-primary …）以字符串形式泄漏进业务层。
 * 这条规则补上那道缺口：业务/布局/路由层只准用我们自己的语义类（bg-surface / text-fg-muted …），
 * 一旦混入具体库的类名即失败 —— 保证「换库时业务层 className 一行不动」真正成立。
 */
const ROOT = resolve(import.meta.dirname, '..');
const SCAN_DIRS = ['app', 'features', 'routes'];

// HeroUI（NextUI）专有的 Tailwind token —— 业务层禁止直接使用：
//  1) 语义色板（content/default/primary…）
//  2) 语义 shadow / radius（small|medium|large）
//  3) react-aria 的 data-[hover|focus|pressed…] 变体
const FORBIDDEN_PATTERNS = [
  /\b(?:bg|text|border|ring|divide|from|to|via|fill|stroke)-(?:content[1-4]|default-\d|primary|secondary|success|warning|danger|focus)\b/g,
  /\b(?:shadow|rounded)-(?:small|medium|large)\b/g,
  /\bdata-\[(?:hover|focus|focus-visible|pressed|selected|disabled|open)\b/g,
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

describe('UI 库样式边界', () => {
  it('业务层不得使用 HeroUI 专有 Tailwind 语义类', () => {
    const offenders: string[] = [];
    for (const d of SCAN_DIRS) {
      for (const file of walk(join(ROOT, d))) {
        const lines = readFileSync(file, 'utf8').split('\n');
        lines.forEach((line: string, i: number) => {
          for (const pattern of FORBIDDEN_PATTERNS) {
            for (const m of line.matchAll(pattern)) {
              offenders.push(`${file}:${i + 1}  →  "${m[0]}"`);
            }
          }
        });
      }
    }
    expect(offenders, `发现 HeroUI 专有类泄漏到业务层，请改用 @theme 语义类：\n${offenders.join('\n')}`).toEqual([]);
  });
});
