import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

// Update the footerSections object in Footer.js
const footerSections = {
  explore: [
    { name: 'Latest Articles', href: '/blog' },
    { name: 'Popular Posts', href: '/blog?filter=popular' },
    { name: 'Habit Tracker', href: '/habit-tracker' },
    { name: 'Success Stories', href: '/success-stories' },
  ],
  topics: [
    { name: 'Habit Formation', href: '/blog?category=habit-formation' },
    { name: 'Digital Wellness', href: '/blog?category=digital-wellness' },
    { name: 'Productivity', href: '/blog?category=productivity' },
    { name: 'Psychology', href: '/blog?category=psychology' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info Column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-[#DBDBDB] mb-4">
              YourLogo
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We help businesses grow with innovative digital solutions and
              exceptional service.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#DBDBDB] mr-3" />
                <span className="text-gray-300">hello@yourcompany.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#DBDBDB] mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#DBDBDB] mr-3" />
                <span className="text-gray-300">New York, NY</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
<div>
  <h3 className="text-lg font-semibold mb-4">Company</h3>
  <ul className="space-y-2">
    {footerSections.company.map((item) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

          {/* Topics Links */}
<div>
  <h3 className="text-lg font-semibold mb-4">Topics</h3>
  <ul className="space-y-2">
    {footerSections.topics.map((item) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

          {/* Explore Links */}
<div>
  <h3 className="text-lg font-semibold mb-4">Explore</h3>
  <ul className="space-y-2">
    {footerSections.explore.map((item) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Media Links */}
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Your Company. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
