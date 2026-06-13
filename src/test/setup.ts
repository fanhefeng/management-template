import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom 不实现 matchMedia；useDevice 依赖它，这里提供默认（桌面）mock。
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
