/* eslint import/no-extraneous-dependencies: [0] */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './components/App';
import StandardHorizontalLayout from './components/StandardHorizontalLayout';
import StandardVerticalLayout from './components/StandardVerticalLayout';
import LayoutWithMinimalSize from './components/LayoutWithMinimalSize';
import PercentageLayout from './components/PercentageLayout';
import NestedLayout from './components/NestedLayout';
import TogglableSidebarLayout from './components/TogglableSidebarLayout';
import HorizontalLayoutWithEvents from './components/HorizontalLayoutWithEvents';
import HorizontalLayoutWithIFrame from './components/HorizontalLayoutWithIFrame';
import '../../lib/index.css';
import '../stylesheets/index.css';

function NoMatch() {
  return (
    <div className="not-found">
      <h2>Not Found</h2>
      <p>Please one of links on the left.</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App>
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/standard-horizontal" element={<StandardHorizontalLayout />} />
          <Route path="/standard-vertical" element={<StandardVerticalLayout />} />
          <Route path="/minimal-size" element={<LayoutWithMinimalSize />} />
          <Route path="/percentage" element={<PercentageLayout />} />
          <Route path="/nested" element={<NestedLayout />} />
          <Route path="/sidebar" element={<TogglableSidebarLayout />} />
          <Route path="/events" element={<HorizontalLayoutWithEvents />} />
          <Route path="/iframe" element={<HorizontalLayoutWithIFrame />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </App>
    </HashRouter>
  </React.StrictMode>
);
