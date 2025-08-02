// app/shop/page.js
import ShopClient from './ShopClient';

// This is a server component that renders the client component
export default function ShopPage() {
  return <ShopClient />;
}

// Add metadata for SEO
export const metadata = {
  title: 'Shop - Habit Formation Tools | HabitNova',
  description: 'Discover scientifically-backed tools and products to help you build better habits and transform your daily routine.',
  keywords: 'habit tracker, productivity tools, wellness products, behavior change',
};