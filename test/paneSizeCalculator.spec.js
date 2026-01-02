import { calculateSecondaryPaneSize } from '../src/components/paneSizeCalculator';

describe('calculateSecondaryPaneSize', () => {
  it('should get correct secondary pane size when horizontal, pixel sizing and first child as primary', () => {
    const config = {
      vertical: false,
      percentage: false,
      primaryIndex: 0,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };
    const position = { left: 50, top: 200 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(972);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(970);
  });

  it('should get correct secondary pane size when vertical, pixel sizing and first child as primary', () => {
    const config = {
      vertical: true,
      percentage: false,
      primaryIndex: 0,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 40, left: 0, width: 1024, height: 4 };
    const position = { left: 50, top: 200 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(310);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(308);
  });

  it('should get correct secondary pane size when horizontal, percentage sizing and first child as primary', () => {
    const config = {
      vertical: false,
      percentage: true,
      primaryIndex: 0,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };
    const position = { left: 512, top: 128 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(49.8046875);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(49.609375);
  });

  it('should get correct secondary pane size when vertical, percentage sizing and first child as primary', () => {
    const config = {
      vertical: true,
      percentage: true,
      primaryIndex: 0,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 512, height: 4 };
    const position = { left: 512, top: 128 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(74.609375);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(74.21875);
  });

  it('should get correct secondary pane size when horizontal, pixel sizing and second child as primary', () => {
    const config = {
      vertical: false,
      percentage: false,
      primaryIndex: 1,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };
    const position = { left: 50, top: 200 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(48);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(50);
  });

  it('should get correct secondary pane size when vertical, pixel sizing and second child as primary', () => {
    const config = {
      vertical: true,
      percentage: false,
      primaryIndex: 1,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 40, left: 0, width: 1024, height: 4 };
    const position = { left: 50, top: 200 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(198);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(200);
  });

  it('should get correct secondary pane size when horizontal, percentage sizing and second child as primary', () => {
    const config = {
      vertical: false,
      percentage: true,
      primaryIndex: 1,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };
    const position = { left: 512, top: 128 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(49.8046875);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(50);
  });

  it('should get correct secondary pane size when vertical, percentage sizing and second child as primary', () => {
    const config = {
      vertical: true,
      percentage: true,
      primaryIndex: 1,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 512, height: 4 };
    const position = { left: 512, top: 128 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(24.609375);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(25);
  });

  it('should adjust the pane size when exceeds limit', () => {
    const config = {
      vertical: false,
      percentage: false,
      primaryIndex: 0,
      primaryMinSize: 0,
      secondaryMinSize: 0
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: -10, top: 200 }, true)).toBe(1020);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: -10, top: 200 }, false)).toBe(1020);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: 1050, top: 200 }, true)).toBe(0);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: 1050, top: 200 }, false)).toBe(0);
  });

  it('should respect user setting of secondary pane minimal size', () => {
    const config = {
      vertical: false,
      percentage: false,
      primaryIndex: 0,
      primaryMinSize: 0,
      secondaryMinSize: 200
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };
    const position = { left: 1024, top: 200 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(200);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(200);
  });

  it('should respect primary pane minimal size over secondary pane minimal size', () => {
    const config = {
      vertical: false,
      percentage: false,
      primaryIndex: 0,
      primaryMinSize: 600,
      secondaryMinSize: 600
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: 500, top: 200 }, true)).toBe(420);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: 500, top: 200 }, false)).toBe(420);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: 900, top: 200 }, true)).toBe(420);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, { left: 900, top: 200 }, false)).toBe(420);
  });

  it('should respect primary pane minimal size over secondary pane minimal size when width is not enough', () => {
    const config = {
      vertical: false,
      percentage: false,
      primaryIndex: 0,
      primaryMinSize: 1200,
      secondaryMinSize: 200
    };
    const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
    const splitterRect = { top: 0, left: 40, width: 4, height: 512 };
    const position = { left: 200, top: 200 };

    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, true)).toBe(0);
    expect(calculateSecondaryPaneSize(config, containerRect, splitterRect, position, false)).toBe(0);
  });
});
