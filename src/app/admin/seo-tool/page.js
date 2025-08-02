// src/app/admin/seo-tool/page.js
import SeoInterlinkingTool from './SeoInterlinkingTool';

export default function SEOToolPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 lg:pt-20">
      <SeoInterlinkingTool />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'SEO Interlinking Tool - Habit Nova Admin',
  description: 'AI-powered internal linking optimization for Habit Nova blog',
  robots: 'noindex, nofollow' // Keep this private from search engines
};