import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import SplitterLayout from '../src/components/SplitterLayout';

describe('SplitterLayout', () => {
  describe('rendering', () => {
    it('should render correctly when 2 children provided', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const layoutContainer = container.firstChild as HTMLElement;
      expect(layoutContainer.tagName).toBe('DIV');
      expect(layoutContainer).toHaveClass('splitter-layout');
      expect(layoutContainer).not.toHaveClass('splitter-layout-vertical');

      const panes = container.querySelectorAll('.layout-pane');
      expect(panes).toHaveLength(2);
      expect(panes[0]).toHaveClass('layout-pane-primary');
      expect(panes[1]).not.toHaveClass('layout-pane-primary');

      const splitter = container.querySelector('.layout-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should render properties correctly if requested', () => {
      const { container } = render(
        <SplitterLayout
          customClassName="custom-class"
          vertical
          percentage
          primaryIndex={1}
        >
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const layoutContainer = container.firstChild as HTMLElement;
      expect(layoutContainer.tagName).toBe('DIV');
      expect(layoutContainer).toHaveClass('splitter-layout');
      expect(layoutContainer).toHaveClass('custom-class');
      expect(layoutContainer).toHaveClass('splitter-layout-vertical');

      const panes = container.querySelectorAll('.layout-pane');
      expect(panes).toHaveLength(2);
      expect(panes[0]).not.toHaveClass('layout-pane-primary');
      expect(panes[1]).toHaveClass('layout-pane-primary');

      const splitter = container.querySelector('.layout-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should set the first children as primary if invalid primary index is provided', () => {
      const { container } = render(
        <SplitterLayout primaryIndex={5}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const layoutContainer = container.firstChild as HTMLElement;
      expect(layoutContainer.tagName).toBe('DIV');
      expect(layoutContainer).toHaveClass('splitter-layout');

      const panes = container.querySelectorAll('.layout-pane');
      expect(panes).toHaveLength(2);
      expect(panes[0]).toHaveClass('layout-pane-primary');
      expect(panes[1]).not.toHaveClass('layout-pane-primary');

      const splitter = container.querySelector('.layout-splitter');
      expect(splitter).toBeInTheDocument();
    });

    it('should render one child when nothing provided', () => {
      const { container } = render(<SplitterLayout />);

      const layoutContainer = container.firstChild as HTMLElement;
      expect(layoutContainer.tagName).toBe('DIV');
      expect(layoutContainer).toHaveClass('splitter-layout');

      const panes = container.querySelectorAll('.layout-pane');
      expect(panes).toHaveLength(1);
      expect(panes[0]).toHaveClass('layout-pane-primary');

      const splitter = container.querySelector('.layout-splitter');
      expect(splitter).not.toBeInTheDocument();
    });

    it('should render one child when only 1 child provided', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
        </SplitterLayout>
      );

      const layoutContainer = container.firstChild as HTMLElement;
      expect(layoutContainer.tagName).toBe('DIV');
      expect(layoutContainer).toHaveClass('splitter-layout');

      const panes = container.querySelectorAll('.layout-pane');
      expect(panes).toHaveLength(1);
      expect(panes[0]).toHaveClass('layout-pane-primary');

      const splitter = container.querySelector('.layout-splitter');
      expect(splitter).not.toBeInTheDocument();
    });

    it('should render 2 children when more than 2 children provided', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
          <div>Child #2</div>
          <div>Child #3</div>
          <div>Child #4</div>
        </SplitterLayout>
      );

      const layoutContainer = container.firstChild as HTMLElement;
      expect(layoutContainer.tagName).toBe('DIV');
      expect(layoutContainer).toHaveClass('splitter-layout');

      const panes = container.querySelectorAll('.layout-pane');
      expect(panes).toHaveLength(2);
      expect(panes[0]).toHaveClass('layout-pane-primary');
      expect(panes[1]).not.toHaveClass('layout-pane-primary');

      const splitter = container.querySelector('.layout-splitter');
      expect(splitter).toBeInTheDocument();
    });
  });

  describe('DOM', () => {
    afterEach(() => {
      (document.body as any).createTextRange = undefined;
      (window as any).getSelection = undefined;
      (document as any).selection = undefined;
    });

    it('should add DOM event listeners when mounted', () => {
      const windowSpy = vi.spyOn(window, 'addEventListener');
      const documentSpy = vi.spyOn(document, 'addEventListener');

      render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      expect(windowSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(documentSpy).not.toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(documentSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(documentSpy).not.toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(documentSpy).not.toHaveBeenCalledWith('touchmove', expect.any(Function));

      windowSpy.mockRestore();
      documentSpy.mockRestore();
    });

    it('should remove DOM event listeners when unmounted', () => {
      const { unmount } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const windowSpy = vi.spyOn(window, 'removeEventListener');

      unmount();

      expect(windowSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      windowSpy.mockRestore();
    });

    it('should register and unregister drag listeners on document when drag starts and ends', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter') as HTMLElement;

      const addSpy = vi.spyOn(document, 'addEventListener');
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      fireEvent.mouseDown(splitter);

      expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(addSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(addSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));

      fireEvent.mouseUp(document);

      expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it('should remove drag listeners when unmounted during drag', () => {
      const { container, unmount } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter') as HTMLElement;
      fireEvent.mouseDown(splitter);

      const removeSpy = vi.spyOn(document, 'removeEventListener');
      unmount();

      expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));

      removeSpy.mockRestore();
    });

    it('should set splitter reference when it is rendered', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const layoutContainer = container.querySelector('.splitter-layout');
      const splitter = container.querySelector('.layout-splitter');

      expect(layoutContainer).toBeInTheDocument();
      expect(splitter).toBeInTheDocument();
    });

    it('should not set splitter reference when it is not rendered', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
        </SplitterLayout>
      );

      const layoutContainer = container.querySelector('.splitter-layout');
      const splitter = container.querySelector('.layout-splitter');

      expect(layoutContainer).toBeInTheDocument();
      expect(splitter).not.toBeInTheDocument();
    });

    it('should set resizing state when dragging splitter', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter') as HTMLElement;
      const layoutContainer = container.querySelector('.splitter-layout') as HTMLElement;

      expect(layoutContainer).not.toHaveClass('layout-changing');

      fireEvent.mouseDown(splitter);
      expect(layoutContainer).toHaveClass('layout-changing');

      fireEvent.mouseUp(document);
      expect(layoutContainer).not.toHaveClass('layout-changing');
    });

    it('should set pane size when dragging splitter', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter') as HTMLElement;
      const layoutContainer = container.querySelector('.splitter-layout') as HTMLElement;
      const secondaryPane = container.querySelectorAll('.layout-pane')[1];

      layoutContainer.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      } as DOMRect));
      splitter.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 4,
        height: 300
      } as DOMRect));

      fireEvent.mouseDown(splitter);
      fireEvent.mouseMove(document, { clientX: 25, clientY: 30 });

      expect((secondaryPane as HTMLElement).style.width).toBe('173px');
    });

    it('should keep secondary pane size when resizing', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const layoutContainer = container.querySelector('.splitter-layout') as HTMLElement;
      const splitter = container.querySelector('.layout-splitter') as HTMLElement;
      const secondaryPane = container.querySelectorAll('.layout-pane')[1];

      layoutContainer.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      } as DOMRect));
      splitter.getBoundingClientRect = vi.fn(() => ({
        left: 100,
        top: 0,
        width: 4,
        height: 300
      } as DOMRect));

      fireEvent(window, new Event('resize'));

      expect((secondaryPane as HTMLElement).style.width).toBe('96px');
    });

    it('should trigger drag events when dragging starts and finishes', () => {
      const startFn = vi.fn();
      const endFn = vi.fn();

      const { container } = render(
        <SplitterLayout onDragStart={startFn} onDragEnd={endFn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter') as HTMLElement;

      expect(startFn).not.toHaveBeenCalled();
      expect(endFn).not.toHaveBeenCalled();

      fireEvent.mouseDown(splitter);
      expect(startFn).toHaveBeenCalledTimes(1);
      expect(endFn).not.toHaveBeenCalled();

      fireEvent.mouseUp(document);
      expect(startFn).toHaveBeenCalledTimes(1);
      expect(endFn).toHaveBeenCalledTimes(1);
    });

    it('should trigger size change events when secondary pane size has been changed', () => {
      const fn = vi.fn();

      const { container } = render(
        <SplitterLayout secondaryInitialSize={20} onSecondaryPaneSizeChange={fn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(20);

      const layoutContainer = container.querySelector('.splitter-layout') as HTMLElement;
      const splitter = container.querySelector('.layout-splitter') as HTMLElement;

      layoutContainer.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      } as DOMRect));
      splitter.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 4,
        height: 300
      } as DOMRect));

      fireEvent.mouseDown(splitter);
      fireEvent.mouseMove(document, { clientX: 25, clientY: 30 });

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith(173);
    });

    it('should trigger drag events when touching starts and finishes', () => {
      const startFn = vi.fn();
      const endFn = vi.fn();

      const { container } = render(
        <SplitterLayout onDragStart={startFn} onDragEnd={endFn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter') as HTMLElement;

      expect(startFn).not.toHaveBeenCalled();
      expect(endFn).not.toHaveBeenCalled();

      fireEvent.touchStart(splitter);
      expect(startFn).toHaveBeenCalledTimes(1);
      expect(endFn).not.toHaveBeenCalled();

      fireEvent.touchEnd(document);
      expect(startFn).toHaveBeenCalledTimes(1);
      expect(endFn).toHaveBeenCalledTimes(1);
    });

    it('should trigger size change events when touching moves', () => {
      const fn = vi.fn();

      const { container } = render(
        <SplitterLayout secondaryInitialSize={20} onSecondaryPaneSizeChange={fn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(20);

      const layoutContainer = container.querySelector('.splitter-layout') as HTMLElement;
      const splitter = container.querySelector('.layout-splitter') as HTMLElement;

      layoutContainer.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      } as DOMRect));
      splitter.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 4,
        height: 300
      } as DOMRect));

      fireEvent.touchStart(splitter);
      fireEvent.touchMove(document, {
        changedTouches: [{ clientX: 25, clientY: 30 }]
      });

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith(173);
    });

    it('should initialize horizontal secondary size if requested even when splitter is not rendered', () => {
      const { container } = render(
        <SplitterLayout secondaryInitialSize={20}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const secondaryPane = container.querySelectorAll('.layout-pane')[1];
      expect((secondaryPane as HTMLElement).style.width).toBe('20px');
    });

    it('should initialize vertical secondary size if requested even when splitter is not rendered', () => {
      const { container } = render(
        <SplitterLayout secondaryInitialSize={20} vertical>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const secondaryPane = container.querySelectorAll('.layout-pane')[1];
      expect((secondaryPane as HTMLElement).style.height).toBe('20px');
    });
  });
});
