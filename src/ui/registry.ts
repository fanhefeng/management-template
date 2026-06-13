/**
 * 适配器注册表 —— 切换 UI 库的唯一开关（构建时切换，零运行时开销）。
 *
 * 想从 HeroUI 换成 antd？只改这一行：
 *   export { antdAdapter as adapter } from './adapters/antd';
 * 业务层、契约层一行不动。
 *
 * 若未来需要「运行时动态换皮肤 / AB 测试」，可改成 <UIProvider> + Context，
 * 让组件从 context 取实现 —— 这里预留了这个升级口子。
 */
import { heroAdapter as adapter } from './adapters/hero';

export { adapter };
