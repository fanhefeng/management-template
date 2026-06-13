/**
 * 设计令牌（JS 侧）。
 *
 * 颜色/圆角等「样式令牌」的唯一真源是 src/styles/globals.css 的 @theme 块
 * （那是 Tailwind v4 的 CSS-first 真源），这里不再重复定义、避免双源漂移。
 *
 * 这个文件只保留需要被 JS 逻辑读取的令牌 —— 目前只有断点（useDevice 用它，
 * 与 CSS 媒体查询同源）。
 */
export const breakpoints = {
  sm: 576,
  md: 768, // < md 视为移动端（见 useDevice）
  lg: 992,
  xl: 1200,
} as const;
