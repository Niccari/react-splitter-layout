import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

      const layoutContainer = container.firstChild;
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

      const layoutContainer = container.firstChild;
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

      const layoutContainer = container.firstChild;
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

      const layoutContainer = container.firstChild;
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

      const layoutContainer = container.firstChild;
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

      const layoutContainer = container.firstChild;
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
      document.body.createTextRange = undefined;
      window.getSelection = undefined;
      document.selection = undefined;
    });

    it('should add DOM event listeners when mounted', () => {
      const windowSpy = jest.spyOn(window, 'addEventListener');
      const documentSpy = jest.spyOn(document, 'addEventListener');

      render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      expect(windowSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));

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

      const windowSpy = jest.spyOn(window, 'removeEventListener');
      const documentSpy = jest.spyOn(document, 'removeEventListener');

      unmount();

      expect(windowSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));

      windowSpy.mockRestore();
      documentSpy.mockRestore();
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

      const splitter = container.querySelector('.layout-splitter');
      const layoutContainer = container.querySelector('.splitter-layout');

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

      const splitter = container.querySelector('.layout-splitter');
      const layoutContainer = container.querySelector('.splitter-layout');
      const secondaryPane = container.querySelectorAll('.layout-pane')[1];

      layoutContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      }));
      splitter.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 4,
        height: 300
      }));

      fireEvent.mouseDown(splitter);
      fireEvent.mouseMove(document, { clientX: 25, clientY: 30 });

      expect(secondaryPane.style.width).toBe('173px');
    });

    it('should keep secondary pane size when resizing', () => {
      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const layoutContainer = container.querySelector('.splitter-layout');
      const splitter = container.querySelector('.layout-splitter');
      const secondaryPane = container.querySelectorAll('.layout-pane')[1];

      layoutContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      }));
      splitter.getBoundingClientRect = jest.fn(() => ({
        left: 100,
        top: 0,
        width: 4,
        height: 300
      }));

      fireEvent(window, new Event('resize'));

      expect(secondaryPane.style.width).toBe('96px');
    });

    it('should choose createTextRange() if available to clear selection when dragging requested', () => {
      const collapseFn = jest.fn();
      const selectFn = jest.fn();
      const emptyFn = jest.fn();
      const removeAllRangesFn = jest.fn();
      const selectionEmptyFn = jest.fn();

      document.body.createTextRange = () => ({ collapse: collapseFn, select: selectFn });
      window.getSelection = () => ({ empty: emptyFn, removeAllRanges: removeAllRangesFn });
      document.selection = { empty: selectionEmptyFn };

      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');
      fireEvent.mouseDown(splitter);

      expect(collapseFn).toHaveBeenCalledTimes(1);
      expect(selectFn).toHaveBeenCalledTimes(1);
      expect(emptyFn).not.toHaveBeenCalled();
      expect(removeAllRangesFn).not.toHaveBeenCalled();
      expect(selectionEmptyFn).not.toHaveBeenCalled();
    });

    it('should choose getSelection().empty() if available to clear selection when dragging requested', () => {
      const emptyFn = jest.fn();
      const removeAllRangesFn = jest.fn();
      const selectionEmptyFn = jest.fn();

      window.getSelection = () => ({ empty: emptyFn, removeAllRanges: removeAllRangesFn });
      document.selection = { empty: selectionEmptyFn };

      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');
      fireEvent.mouseDown(splitter);

      expect(emptyFn).toHaveBeenCalledTimes(1);
      expect(removeAllRangesFn).not.toHaveBeenCalled();
      expect(selectionEmptyFn).not.toHaveBeenCalled();
    });

    it('should choose getSelection().removeAllRanges() if available to clear selection when dragging requested', () => {
      const removeAllRangesFn = jest.fn();
      const selectionEmptyFn = jest.fn();

      window.getSelection = () => ({ removeAllRanges: removeAllRangesFn });
      document.selection = { empty: selectionEmptyFn };

      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');
      fireEvent.mouseDown(splitter);

      expect(removeAllRangesFn).toHaveBeenCalledTimes(1);
      expect(selectionEmptyFn).not.toHaveBeenCalled();
    });

    it('should choose getSelection() if available to clear selection when dragging requested', () => {
      const selectionEmptyFn = jest.fn();

      window.getSelection = () => ({});
      document.selection = { empty: selectionEmptyFn };

      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');
      fireEvent.mouseDown(splitter);

      expect(selectionEmptyFn).not.toHaveBeenCalled();
    });

    it('should choose selection.empty() if available to clear selection when dragging requested', () => {
      const selectionEmptyFn = jest.fn();

      document.selection = { empty: selectionEmptyFn };

      const { container } = render(
        <SplitterLayout>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');
      fireEvent.mouseDown(splitter);

      expect(selectionEmptyFn).toHaveBeenCalledTimes(1);
    });

    it('should trigger drag events when dragging starts and finishes', () => {
      const startFn = jest.fn();
      const endFn = jest.fn();

      const { container } = render(
        <SplitterLayout onDragStart={startFn} onDragEnd={endFn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');

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
      const fn = jest.fn();

      const { container } = render(
        <SplitterLayout secondaryInitialSize={20} onSecondaryPaneSizeChange={fn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(20);

      const layoutContainer = container.querySelector('.splitter-layout');
      const splitter = container.querySelector('.layout-splitter');

      layoutContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      }));
      splitter.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 4,
        height: 300
      }));

      fireEvent.mouseDown(splitter);
      fireEvent.mouseMove(document, { clientX: 25, clientY: 30 });

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith(173);
    });

    it('should trigger drag events when touching starts and finishes', () => {
      const startFn = jest.fn();
      const endFn = jest.fn();

      const { container } = render(
        <SplitterLayout onDragStart={startFn} onDragEnd={endFn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const splitter = container.querySelector('.layout-splitter');

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
      const fn = jest.fn();

      const { container } = render(
        <SplitterLayout secondaryInitialSize={20} onSecondaryPaneSizeChange={fn}>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(20);

      const layoutContainer = container.querySelector('.splitter-layout');
      const splitter = container.querySelector('.layout-splitter');

      layoutContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 200,
        height: 300
      }));
      splitter.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 4,
        height: 300
      }));

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
      expect(secondaryPane.style.width).toBe('20px');
    });

    it('should initialize vertical secondary size if requested even when splitter is not rendered', () => {
      const { container } = render(
        <SplitterLayout secondaryInitialSize={20} vertical>
          <div>Child #0</div>
          <div>Child #1</div>
        </SplitterLayout>
      );

      const secondaryPane = container.querySelectorAll('.layout-pane')[1];
      expect(secondaryPane.style.height).toBe('20px');
    });
  });
});
