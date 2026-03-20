import React from 'react';

interface PaneProps {
  vertical?: boolean;
  primary?: boolean;
  size?: number;
  percentage?: boolean;
  children?: React.ReactNode;
}

function Pane({
  vertical = false,
  primary = false,
  size = 0,
  percentage = false,
  children
}: PaneProps) {
  const unit = percentage ? '%' : 'px';
  let classes = 'layout-pane';
  const style: React.CSSProperties = {};
  if (!primary) {
    if (vertical) {
      style.height = `${size}${unit}`;
    } else {
      style.width = `${size}${unit}`;
    }
  } else {
    classes += ' layout-pane-primary';
  }
  return (
    <div className={classes} style={style}>{children}</div>
  );
}

export default Pane;
