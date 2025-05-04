import { Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/index';
import DocsPage from '@/pages/docs';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import { ErrorPage } from '@/pages/Errors/ErrorPage';
import { Layout } from '@/components/Auth/Layout';
import { Login } from '@/components/Auth/Login';

export const Router = () => {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />,
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<Layout />} errorElement={<ErrorPage />} path="/">
        <Route element={<Login />} path="/login" />,
      </Route>
    </Routes>
  );
};
