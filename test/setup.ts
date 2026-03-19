import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock getBoundingClientRect for testing
Element.prototype.getBoundingClientRect = vi.fn(function getBoundingClientRectMock() {
  const el = this as unknown as HTMLElement;
  return {
    width: parseFloat(el.style.width) || 0,
    height: parseFloat(el.style.height) || 0,
    top: parseFloat(el.style.top) || 0,
    left: parseFloat(el.style.left) || 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON() {}
  } as DOMRect;
});

// Keep window.resizeTo (not a standard API)
(window as any).resizeTo = (width: number, height: number) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
};

// Mock requestAnimationFrame to execute synchronously in tests
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0);
  return 0;
};

global.cancelAnimationFrame = () => {};
