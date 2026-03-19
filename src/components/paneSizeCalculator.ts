export interface SizeCalculatorConfig {
  vertical: boolean;
  percentage: boolean;
  primaryIndex: number;
  primaryMinSize: number;
  secondaryMinSize: number;
}

export interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface ClientPosition {
  left: number;
  top: number;
}

export function calculateSecondaryPaneSize(
  config: SizeCalculatorConfig,
  containerRect: Rect,
  splitterRect: Rect,
  clientPosition: ClientPosition,
  offsetMouse: boolean
): number {
  const { vertical, percentage, primaryIndex, primaryMinSize, secondaryMinSize } = config;

  let totalSize;
  let splitterSize;
  let offset;

  if (vertical) {
    totalSize = containerRect.height;
    splitterSize = splitterRect.height;
    offset = clientPosition.top - containerRect.top;
  } else {
    totalSize = containerRect.width;
    splitterSize = splitterRect.width;
    offset = clientPosition.left - containerRect.left;
  }

  if (offsetMouse) {
    offset -= splitterSize / 2;
  }

  if (offset < 0) {
    offset = 0;
  } else if (offset > totalSize - splitterSize) {
    offset = totalSize - splitterSize;
  }

  let secondaryPaneSize;
  if (primaryIndex === 1) {
    secondaryPaneSize = offset;
  } else {
    secondaryPaneSize = totalSize - splitterSize - offset;
  }

  let primaryPaneSize = totalSize - splitterSize - secondaryPaneSize;

  if (percentage) {
    secondaryPaneSize = (secondaryPaneSize * 100) / totalSize;
    primaryPaneSize = (primaryPaneSize * 100) / totalSize;
    splitterSize = (splitterSize * 100) / totalSize;
    totalSize = 100;
  }

  if (primaryPaneSize < primaryMinSize) {
    secondaryPaneSize = Math.max(secondaryPaneSize - (primaryMinSize - primaryPaneSize), 0);
  } else if (secondaryPaneSize < secondaryMinSize) {
    secondaryPaneSize = Math.min(totalSize - splitterSize - primaryMinSize, secondaryMinSize);
  }

  return secondaryPaneSize;
}
