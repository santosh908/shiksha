import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import './bootstrap';
import '../css/app.css';
import '@mantine/dates/styles.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import MasterLayout from './Layouts/master/MasterLayout';

// TODO: Replace with your app name
const appName = import.meta.env.VITE_APP_NAME || '';

createInertiaApp({
  title: (title) => (appName ? `${title} | ${appName}` : title),
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <MasterLayout>
        <App {...props} />
      </MasterLayout>
    );
  },
  progress: false,
});
