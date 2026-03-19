import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Pane from '../src/components/Pane';

describe('Pane', () => {
  it('should render a Pane correctly', () => {
    const { container } = render(<Pane>test pane</Pane>);
    const pane = container.firstChild;

    expect(pane).not.toBeNull();
    expect((pane as HTMLElement).tagName).toBe('DIV');
    expect(pane).toHaveClass('layout-pane');
    expect(pane).toHaveStyle({ width: '0px' });
    expect(pane).toHaveTextContent('test pane');
  });

  it('should render properties of a Pane correctly if requested', () => {
    const { container } = render(
      <Pane vertical size={2} percentage>test pane</Pane>
    );
    const pane = container.firstChild;

    expect(pane).not.toBeNull();
    expect((pane as HTMLElement).tagName).toBe('DIV');
    expect(pane).toHaveClass('layout-pane');
    expect(pane).toHaveStyle({ height: '2%' });
    expect(pane).toHaveTextContent('test pane');
  });

  it('should render a primary Pane correctly if requested', () => {
    const { container } = render(
      <Pane primary vertical size={2} percentage>
        test pane
      </Pane>
    );
    const pane = container.firstChild as HTMLElement;

    expect(pane).not.toBeNull();
    expect(pane.tagName).toBe('DIV');
    expect(pane).toHaveClass('layout-pane');
    expect(pane).toHaveClass('layout-pane-primary');
    expect(pane.style.height).toBe('');
    expect(pane).toHaveTextContent('test pane');
  });
});
