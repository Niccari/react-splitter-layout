import * as React from 'react';

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
   *
   * A primary pane is used to show users primary content, while a secondary pane is the other pane.
   * When window size changes and `percentage` is set to `false`,
   * primary pane's size is flexible and secondary pane's size is kept unchanged.
   * However, when the window size is not enough for showing both minimal primary pane and minimal secondary pane,
   * the primary pane's size is served first.
   * @default 0
   */
  primaryIndex?: number;

  /**
   * Minimal size of primary pane.
   *
   * When `percentage` is set to `false`, this value is pixel size (25 means 25px).
   * When `percentage` is set to `true`, this value is percentage (25 means 25%).
   * @default 0
   */
  primaryMinSize?: number;

  /**
   * Initial size of secondary pane when page loads.
   *
   * If this prop is not defined, `SplitterLayout` tries to split the layout with equal sizes.
   * (Note: equal size may not apply when there are nested layouts.)
   */
  secondaryInitialSize?: number;

  /**
   * Minimal size of secondary pane.
   *
   * When `percentage` is set to `false`, this value is pixel size (25 means 25px).
   * When `percentage` is set to `true`, this value is percentage (25 means 25%).
   * @default 0
   */
  secondaryMinSize?: number;

  /**
   * Called when dragging is started.
   *
   * No parameter will be passed to event handlers.
   */
  onDragStart?: () => void;

  /**
   * Called when dragging finishes.
   *
   * No parameter will be passed to event handlers.
   */
  onDragEnd?: () => void;

  /**
   * Called when the size of secondary pane is changed.
   *
   * Event handlers will be passed with a single parameter of `number` type representing new size of secondary pane.
   * When `percentage` is set to `false`, the value is in pixel size.
   * When `percentage` is set to `true`, the value is in percentage.
   * @param secondaryPaneSize - New size of secondary pane
   */
  onSecondaryPaneSizeChange?: (secondaryPaneSize: number) => void;

  /**
   * Child elements (maximum 2).
   *
   * `SplitterLayout` renders the first 2 direct children only if it has more than 2 direct children.
   * `SplitterLayout` does not render splitter when it has only 1 direct child,
   * and the only direct child occupies all available space.
   */
  children?: React.ReactNode;
}

declare class SplitterLayout extends React.Component<SplitterLayoutProps> {}

export default SplitterLayout;
