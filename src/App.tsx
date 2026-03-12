import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';
import ArchivePage from './pages/ArchivePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TagPage from './pages/TagPage';

export default function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<PostPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="tag/:tag" element={<TagPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </HelmetProvider>
  );
}
