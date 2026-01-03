/**
 * Calculate the secondary pane size based on container dimensions and splitter position
 * @param {Object} config - Configuration object
 * @param {boolean} config.vertical - Whether the layout is vertical
 * @param {boolean} config.percentage - Whether to use percentage-based sizing
 * @param {number} config.primaryIndex - Index of the primary pane (0 or 1)
 * @param {number} config.primaryMinSize - Minimum size for the primary pane
 * @param {number} config.secondaryMinSize - Minimum size for the secondary pane
 * @param {DOMRect} containerRect - Container bounding rectangle
 * @param {DOMRect} splitterRect - Splitter bounding rectangle
 * @param {Object} clientPosition - Client position object
 * @param {number} clientPosition.left - X coordinate
 * @param {number} clientPosition.top - Y coordinate
 * @param {boolean} offsetMouse - Whether to offset by half the splitter size
 * @returns {number} Calculated secondary pane size
 */
// eslint-disable-next-line import/prefer-default-export
export function calculateSecondaryPaneSize(config, containerRect, splitterRect, clientPosition, offsetMouse) {
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
