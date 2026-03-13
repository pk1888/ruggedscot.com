import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';
import ArchivePage from './pages/ArchivePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TagPage from './pages/TagPage';
import MailingListPage from './pages/MailingListPage';

function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const redirect = sessionStorage.getItem('spa-redirect');
    if (redirect && location.pathname === '/') {
      sessionStorage.removeItem('spa-redirect');
      navigate(redirect, { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RedirectHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<PostPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="tag/:tag" element={<TagPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="subscribe" element={<MailingListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
