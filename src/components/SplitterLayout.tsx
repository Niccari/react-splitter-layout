import React, { useState, useEffect, useRef, useCallback } from 'react';
import Pane from './Pane';
import { calculateSecondaryPaneSize } from './paneSizeCalculator';
import type { Rect, ClientPosition } from './paneSizeCalculator';

export interface SplitterLayoutProps {
  /**
   * Custom CSS class name applied to the layout `div`.
   * You can use this to customize layout style.
   */
  customClassName?: string;

  /**
   * Determine whether the layout should be a horizontal split or a vertical split.
   * @default false
   */
  vertical?: boolean;

  /**
   * Determine whether the width of each pane should be calculated in percentage or by pixels.
   * The default value is `false`, which means width is calculated in pixels.
   * @default false
   */
  percentage?: boolean;

  /**
   * Index of the primary pane. Since `SplitterLayout` supports at most 2 children, only `0` or `1` is allowed.
   * @default 0
   */
  primaryIndex?: number;

  /**
   * Minimal size of primary pane.
   * @default 0
   */
  primaryMinSize?: number;

  /**
   * Initial size of secondary pane when page loads.
   */
  secondaryInitialSize?: number;

  /**
   * Minimal size of secondary pane.
   * @default 0
   */
  secondaryMinSize?: number;

  /**
   * Called when dragging is started.
   */
  onDragStart?: () => void;

  /**
   * Called when dragging finishes.
   */
  onDragEnd?: () => void;

  /**
   * Called when the size of secondary pane is changed.
   * @param secondaryPaneSize - New size of secondary pane
   */
  onSecondaryPaneSizeChange?: (secondaryPaneSize: number) => void;

  /**
   * Child elements (maximum 2).
   */
  children?: React.ReactNode;
}

const DEFAULT_SPLITTER_SIZE = 4;

function SplitterLayout({
  customClassName = '',
  vertical = false,
  percentage = false,
  primaryIndex = 0,
  primaryMinSize = 0,
  secondaryInitialSize,
  secondaryMinSize = 0,
  onDragStart,
  onDragEnd,
  onSecondaryPaneSizeChange,
  children
}: SplitterLayoutProps) {
  const [secondaryPaneSize, setSecondaryPaneSize] = useState(0);
  const [resizing, setResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const splitterRef = useRef<HTMLDivElement | null>(null);
  const rafPendingRef = useRef(false);
  const latestMoveRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const resizingRef = useRef(false);
  const registeredListenersRef = useRef<{
    mouseUp: () => void;
    mouseMove: (e: MouseEvent) => void;
    touchEnd: () => void;
    touchMove: (e: TouchEvent) => void;
  } | null>(null);

  // Keep latest prop values in refs so event handlers remain stable
  const verticalRef = useRef(vertical);
  const percentageRef = useRef(percentage);
  const primaryIndexRef = useRef(primaryIndex);
  const primaryMinSizeRef = useRef(primaryMinSize);
  const secondaryMinSizeRef = useRef(secondaryMinSize);
  const onSecondaryPaneSizeChangeRef = useRef(onSecondaryPaneSizeChange);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);

  // Sync prop refs on every render
  verticalRef.current = vertical;
  percentageRef.current = percentage;
  primaryIndexRef.current = primaryIndex;
  primaryMinSizeRef.current = primaryMinSize;
  secondaryMinSizeRef.current = secondaryMinSize;
  onSecondaryPaneSizeChangeRef.current = onSecondaryPaneSizeChange;
  onDragStartRef.current = onDragStart;
  onDragEndRef.current = onDragEnd;

  const calcSecondaryPaneSize = useCallback((
    containerRect: Rect,
    splitterRect: Rect,
    clientPosition: ClientPosition,
    offsetMouse: boolean
  ) => calculateSecondaryPaneSize(
    {
      vertical: verticalRef.current,
      percentage: percentageRef.current,
      primaryIndex: primaryIndexRef.current,
      primaryMinSize: primaryMinSizeRef.current,
      secondaryMinSize: secondaryMinSizeRef.current
    },
    containerRect,
    splitterRect,
    clientPosition,
    offsetMouse
  ), []);

  const handleResize = useCallback(() => {
    if (splitterRef.current && !percentageRef.current) {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const splitterRect = splitterRef.current.getBoundingClientRect();
      const size = calcSecondaryPaneSize(containerRect, splitterRect, {
        left: splitterRect.left,
        top: splitterRect.top
      }, false);
      setSecondaryPaneSize(size);
      onSecondaryPaneSizeChangeRef.current?.(size);
    }
  }, [calcSecondaryPaneSize]);

  const processMoveAt = useCallback((clientX: number, clientY: number) => {
    if (resizingRef.current) {
      latestMoveRef.current = { clientX, clientY };
      if (!rafPendingRef.current) {
        rafPendingRef.current = true;
        rafIdRef.current = requestAnimationFrame(() => {
          rafPendingRef.current = false;
          rafIdRef.current = null;
          const move = latestMoveRef.current;
          if (move && resizingRef.current) {
            const containerRect = containerRef.current!.getBoundingClientRect();
            const splitterRect = splitterRef.current!.getBoundingClientRect();
            const size = calcSecondaryPaneSize(containerRect, splitterRect, {
              left: move.clientX,
              top: move.clientY
            }, true);
            setSecondaryPaneSize(size);
            onSecondaryPaneSizeChangeRef.current?.(size);
          }
        });
      }
    }
  }, [calcSecondaryPaneSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    processMoveAt(e.clientX, e.clientY);
  }, [processMoveAt]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    processMoveAt(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }, [processMoveAt]);

  const removeDragListeners = useCallback(() => {
    const listeners = registeredListenersRef.current;
    if (listeners) {
      document.removeEventListener('mouseup', listeners.mouseUp);
      document.removeEventListener('mousemove', listeners.mouseMove);
      document.removeEventListener('touchend', listeners.touchEnd);
      document.removeEventListener('touchmove', listeners.touchMove);
      registeredListenersRef.current = null;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      rafPendingRef.current = false;
    }
    latestMoveRef.current = null;
    if (resizingRef.current) {
      resizingRef.current = false;
      setResizing(false);
      onDragEndRef.current?.();
    }
    removeDragListeners();
  }, [removeDragListeners]);

  const handleSplitterMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    setResizing(true);
    onDragStartRef.current?.();
    registeredListenersRef.current = {
      mouseUp: handleMouseUp,
      mouseMove: handleMouseMove,
      touchEnd: handleMouseUp,
      touchMove: handleTouchMove
    };
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
  }, [handleMouseUp, handleMouseMove, handleTouchMove]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    let initialSize: number;
    if (secondaryInitialSize !== undefined) {
      initialSize = secondaryInitialSize;
    } else {
      const containerRect = containerRef.current!.getBoundingClientRect();
      let splitterRect: Rect;
      if (splitterRef.current) {
        splitterRect = splitterRef.current.getBoundingClientRect();
      } else {
        splitterRect = { width: DEFAULT_SPLITTER_SIZE, height: DEFAULT_SPLITTER_SIZE, top: 0, left: 0 };
      }
      initialSize = calcSecondaryPaneSize(containerRect, splitterRect, {
        left: containerRect.left + (containerRect.width - splitterRect.width) / 2,
        top: containerRect.top + (containerRect.height - splitterRect.height) / 2
      }, false);
    }
    setSecondaryPaneSize(initialSize);
    onSecondaryPaneSizeChangeRef.current?.(initialSize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Defensive cleanup: remove drag listeners if component unmounts mid-drag
      removeDragListeners();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        rafPendingRef.current = false;
      }
    };
  }, []); // mount-only: handlers are stable via useCallback, secondaryInitialSize intentionally read once

  let containerClasses = 'splitter-layout';
  if (customClassName) {
    containerClasses += ` ${customClassName}`;
  }
  if (vertical) {
    containerClasses += ' splitter-layout-vertical';
  }
  if (resizing) {
    containerClasses += ' layout-changing';
  }

  const childrenArray = React.Children.toArray(children).slice(0, 2);
  if (childrenArray.length === 0) {
    childrenArray.push(<div />);
  }

  const validPrimaryIndex = primaryIndex !== 0 && primaryIndex !== 1 ? 0 : primaryIndex;
  const wrappedChildren: React.ReactElement[] = [];
  for (let i = 0; i < childrenArray.length; ++i) {
    const isPrimary = childrenArray.length === 1 || i === validPrimaryIndex;
    const size = isPrimary ? undefined : secondaryPaneSize;
    wrappedChildren.push(
      <Pane vertical={vertical} percentage={percentage} primary={isPrimary} size={size}>
        {childrenArray[i]}
      </Pane>
    );
  }

  return (
    <div className={containerClasses} ref={containerRef}>
      {wrappedChildren[0]}
      {wrappedChildren.length > 1 && (
        <div
          role="separator"
          className="layout-splitter"
          ref={splitterRef}
          onMouseDown={handleSplitterMouseDown}
          onTouchStart={handleSplitterMouseDown}
        />
      )}
      {wrappedChildren.length > 1 && wrappedChildren[1]}
    </div>
  );
}

export default SplitterLayout;
