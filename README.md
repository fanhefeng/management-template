# 管理后台模板（UI 库可替换 · 移动端自适应）

一个**不绑定具体 UI 组件库**的 React 后台管理平台模板。业务代码只依赖自定义的 `@/ui` 门面，
具体 UI 库（当前 HeroUI）是「可替换的实现细节」——换库只改适配器，业务零改动。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | React 19 + TypeScript（SPA，对接现有 API） |
| 路由 | TanStack Router（类型安全、文件式、loader 预取） |
| 服务端状态 | TanStack Query + axios |
| 客户端状态 | Zustand |
| UI 库（首个适配器） | HeroUI v3 + Tailwind v4（CSS-first，无 tailwind.config） |
| 工程化 | Vite 8（Rolldown 内核）+ Oxlint + Oxfmt + Vitest（VoidZero 工具链） |

## 快速开始

```bash
pnpm install
pnpm dev      # 首次启动会自动生成 src/routeTree.gen.ts
```

> 演示账号：登录页直接点「登录」即可（mock 鉴权）。用户管理页自带 mock 数据，无需后端。

其他命令：

```bash
pnpm typecheck     # 仅 TypeScript 类型检查（tsc -b）
pnpm build         # tsc 类型检查 + vite 构建
pnpm lint          # Oxlint（含 UI 库边界检查）
pnpm format        # Oxfmt 格式化
pnpm test          # Vitest（契约 + 渲染 + 边界守卫）
```

> 可选:开发期接入 `@tanstack/react-query-devtools` 与 `@tanstack/react-router-devtools`
> 可视化缓存与路由状态(需自行安装,本模板未默认引入)。

## 架构：三层依赖倒置

```
业务层 (features/ routes/)        只 import '@/ui'，不知道 HeroUI 存在
        ↓
契约层 @/ui (src/ui/contract)     你定义的稳定 Props 接口，永不随库变
        ↓
适配器层 @/ui/adapters/hero       唯一与 HeroUI 耦合的地方
        ↓
具体 UI 库 HeroUI                 可替换的实现细节
```

### 如何更换 UI 库（例：换成 antd）

1. 新建 `src/ui/adapters/antd/`，为每个组件实现同一份契约（`ButtonProps` 等），
   把契约语义翻译成 antd 的 API。
2. 改 `src/ui/registry.ts` **一行**：
   ```ts
   export { antdAdapter as adapter } from './adapters/antd';
   ```
3. 完成。业务层、契约层一行不动。`pnpm test` 跑契约测试验收。

### 防腐红线（两道）

1. **import 边界**：`.oxlintrc.json` 的 `no-restricted-imports` 禁止 `src/ui/adapters/**` 之外
   直接 import `@heroui/*`，强制走 `@/ui`。
2. **className 边界**：`src/test/boundary.test.ts` 禁止业务层（`app`/`features`/`routes`）出现 HeroUI
   专有 Tailwind 类（`bg-content1`/`text-default-*`/`text-primary` …），只准用 `@theme` 定义的
   语义类。两道一起,才能保证「换库时业务层一行不动」在 import 层和样式层都成立。

## 主题与设计令牌（不绑库）

- **样式真源**：`src/styles/globals.css` 的 `@theme` 块定义一套**库无关的语义色**
  （`--color-canvas` / `--color-surface` / `--color-fg` / `--color-accent` …），Tailwind 据此生成
  `bg-canvas`/`text-fg-muted`/`bg-accent` 等工具类。
- 业务/布局/页面层只用这套**自有语义类**，不碰 HeroUI 的 `content`/`default`/`primary` 色板。
- 换库时业务层 className 一行不动；新库的适配器组件继续映射到同一套语义变量即可。
- `src/design/tokens.ts` 只保留需被 JS 读取的令牌（断点，供 `useDevice` 用），不与 CSS 重复。

## 移动端适配

- **布局**：单一响应式 `AppLayout`，用 Tailwind `md:` 断点切换侧边栏/底部 Tab，`<Outlet/>`
  跨断点稳定常挂（不会因旋转/缩窗重挂丢状态）。
- **组件形态**：响应式降级在**库无关**的 `@/ui` 层完成（`src/ui/index.tsx` 的 `Table` 包装）——
  桌面用适配器表格，移动用 `MobileCardList`（库无关组件）。适配器只需实现桌面表格。
- 设备判断用 `matchMedia`（非 UA），与 CSS 断点同源（`src/design/tokens.ts`）。

## 目录

```
src/
├─ ui/                  门面 + 契约 + 适配器（UI 库可换的核心）
│  ├─ contract/         库无关的 Props 接口
│  ├─ adapters/hero/    HeroUI v3 适配器（只实现桌面形态）
│  ├─ responsive/       库无关：MobileCardList + 单元格兜底
│  ├─ registry.ts       切换 UI 库的唯一开关
│  └─ index.tsx         业务唯一入口（含响应式降级）
├─ app/                 框架无关骨架
│  ├─ hooks/useDevice   设备判断（matchMedia）
│  ├─ layout/AppLayout  单一响应式布局壳
│  ├─ notify/           库无关通知 store + Toaster（失败路径统一出口）
│  ├─ request/          axios(http) + queryClient（含全局 onError）
│  └─ store/            Zustand
├─ design/tokens.ts     JS 侧令牌（仅断点）
├─ features/users/      CRUD 示例（数据层 + 页面）
├─ routes/              TanStack Router 文件式路由（__root 含 errorComponent）
└─ styles/globals.css   Tailwind + HeroUI 入口 + @theme 语义令牌
```
