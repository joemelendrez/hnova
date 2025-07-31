// src/app/admin/seo-tool/page.js
import SEOInterlinkingTool from './SEOInterlinkingTool';

export default function SEOToolPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOInterlinkingTool />
    </div>
  );
}

export const metadata = {
  title: 'SEO Interlinking Tool - HabitNova Admin',
  description: 'AI-powered internal linking optimization for HabitNova blog',
  robots: 'noindex, nofollow' // Keep this private from search engines
};