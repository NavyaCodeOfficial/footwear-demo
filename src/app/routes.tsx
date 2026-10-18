import type { RouteRecord } from 'vite-react-ssg';
import Layout from '../components/layout/Layout';
import { policies } from '../data/policies';
import { AboutPage, ContactPage, FaqPage, NotFoundPage } from '../pages/InfoPages';
import { PolicyPage } from '../pages/PolicyPage';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/layout/Layout.tsx',
    children: [
      { index: true, lazy: () => import('../pages/HomePage') },
      { path: 'shop', lazy: () => import('../pages/ShopPage') },
      { path: 'category/:slug', lazy: () => import('../pages/CategoryPage') },
      { path: 'product/:slug', lazy: () => import('../pages/ProductPage') },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FaqPage /> },
      ...policies.map((p) => ({ path: p.slug, element: <PolicyPage slug={p.slug} /> })),
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
