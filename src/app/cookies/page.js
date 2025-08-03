// src/app/cookies/page.js
export const metadata = {
  title: 'Cookie Policy | Habit Nova',
  description:
    'Cookie Policy for Habit Nova - How we use cookies and tracking technologies on our website.',
  robots: 'index, follow',
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="py-12 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 font-anton uppercase">
            Cookie Policy.
          </h1>
          <p className="text-xl text-gray-200">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-xl max-w-none legal-content">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              1. What Are Cookies?
            </h2>

            <p className="text-lg leading-relaxed mb-12">
              Cookies are small text files that are stored on your device when
              you visit our website. They help us provide you with a better
              browsing experience by remembering your preferences and analyzing
              how you use our site.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              2. How We Use Cookies
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              We use cookies for several purposes:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Essential Functionality:</strong> Enable core website
                features
              </li>
              <li>
                <strong>User Preferences:</strong> Remember your settings and
                choices
              </li>
              <li>
                <strong>Analytics:</strong> Understand how visitors use our
                website
              </li>
              <li>
                <strong>Marketing:</strong> Show relevant content and
                advertisements
              </li>
              <li>
                <strong>Affiliate Tracking:</strong> Track referrals for
                commission purposes
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              3. Types of Cookies We Use
            </h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Essential Cookies
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              These cookies are necessary for the website to function properly:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-3 font-semibold">Cookie Name</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                    <th className="text-left p-3 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">session_id</td>
                    <td className="p-3">Maintain user session</td>
                    <td className="p-3">Session</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">cart_contents</td>
                    <td className="p-3">Remember shopping cart items</td>
                    <td className="p-3">30 days</td>
                  </tr>
                  <tr>
                    <td className="p-3">cookie_consent</td>
                    <td className="p-3">Remember your cookie preferences</td>
                    <td className="p-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Analytics Cookies
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              We use analytics services to understand website usage:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-3 font-semibold">Service</th>
                    <th className="text-left p-3 font-semibold">Cookies</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">Google Analytics</td>
                    <td className="p-3">_ga, _ga_*, _gid</td>
                    <td className="p-3">Track website usage and performance</td>
                  </tr>
                  <tr>
                    <td className="p-3">Hotjar</td>
                    <td className="p-3">_hjid, _hjSessionUser_*</td>
                    <td className="p-3">User behavior analysis and heatmaps</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Marketing and Advertising Cookies
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              These cookies help us show relevant content and track marketing
              effectiveness:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-3 font-semibold">Service</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                    <th className="text-left p-3 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">Facebook Pixel</td>
                    <td className="p-3">Track conversions and retargeting</td>
                    <td className="p-3">90 days</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">Google Ads</td>
                    <td className="p-3">Measure ad performance</td>
                    <td className="p-3">30 days</td>
                  </tr>
                  <tr>
                    <td className="p-3">Email Marketing</td>
                    <td className="p-3">Track email campaign effectiveness</td>
                    <td className="p-3">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Affiliate Tracking Cookies
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              We use affiliate cookies to track referrals and commissions:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Amazon Associates:</strong> Track purchases made through
                our Amazon links
              </li>
              <li>
                <strong>Partner Programs:</strong> Track referrals to products
                we recommend
              </li>
              <li>
                <strong>Duration:</strong> Typically 24 hours to 30 days
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              4. Third-Party Cookies
            </h2>

            <p className="text-lg leading-relaxed mb-8">
              Some cookies are set by third-party services we use:
            </p>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Social Media
            </h3>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>
                <strong>YouTube:</strong> For embedded videos
              </li>
              <li>
                <strong>Twitter:</strong> For social sharing buttons
              </li>
              <li>
                <strong>Facebook:</strong> For social plugins and tracking
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              E-commerce
            </h3>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>
                <strong>Shopify:</strong> For our online store functionality
              </li>
              <li>
                <strong>Stripe/PayPal:</strong> For payment processing
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Email Marketing
            </h3>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Mailchimp:</strong> For newsletter and email campaigns
              </li>
              <li>
                <strong>ConvertKit:</strong> For marketing automation
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              5. Managing Your Cookie Preferences
            </h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Browser Settings
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              You can control cookies through your browser settings:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and Security →
                Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Options → Privacy & Security → Cookies
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Cookies
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and Site Permissions
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Opt-Out Links
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              You can opt out of specific tracking services:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener"
                  className="text-[#1a1a1a] hover:underline font-medium"
                >
                  Google Analytics Opt-out
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/settings?tab=ads"
                  target="_blank"
                  rel="noopener"
                  className="text-[#1a1a1a] hover:underline font-medium"
                >
                  Facebook Ad Preferences
                </a>
              </li>
              <li>
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener"
                  className="text-[#1a1a1a] hover:underline font-medium"
                >
                  Digital Advertising Alliance Opt-out
                </a>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">
              Our Cookie Preference Center
            </h3>
            <div className="bg-blue-50 p-8 rounded-xl mb-12">
              <p className="text-lg mb-6">
                Manage your cookie preferences for this website:
              </p>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-base">
                    Essential Cookies (Required)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-base">Analytics Cookies</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-base">Marketing Cookies</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-base">Affiliate Tracking Cookies</span>
                </label>
              </div>
              <button className="mt-6 px-6 py-3 bg-[#1a1a1a] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Save Preferences
              </button>
            </div>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              6. Impact of Disabling Cookies
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              If you disable cookies, some website features may not work
              properly:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Shopping Cart:</strong> Items may not be saved between
                sessions
              </li>
              <li>
                <strong>Preferences:</strong> Settings won't be remembered
              </li>
              <li>
                <strong>Analytics:</strong> We can't improve the website based
                on usage data
              </li>
              <li>
                <strong>Personalization:</strong> Content may be less relevant
                to your interests
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              7. Cookie Lifespan
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Different cookies have different lifespans:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Session Cookies:</strong> Deleted when you close your
                browser
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Remain until they expire or
                you delete them
              </li>
              <li>
                <strong>Our Policy:</strong> We regularly review and clean up
                old cookies
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              8. Updates to This Policy
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              We may update this Cookie Policy to reflect changes in:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Our use of cookies</li>
              <li>Legal requirements</li>
              <li>Third-party services we use</li>
            </ul>

            <p className="text-lg leading-relaxed mb-12">
              We will notify you of significant changes by updating the "Last
              updated" date and posting the new policy on our website.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">
              9. Contact Us
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Email:</strong> privacy@habitnova.com
              </li>
              <li>
                <strong>Contact Form:</strong>{' '}
                <a
                  href="/contact"
                  className="text-[#1a1a1a] hover:underline font-medium"
                >
                  habitnova.com/contact
                </a>
              </li>
            </ul>

            <div className="mt-16 p-8 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-6">Quick Cookie Guide</h3>
              <ul className="space-y-4 text-lg leading-relaxed">
                <li>
                  • Essential cookies are required for the website to work
                </li>
                <li>• Analytics cookies help us improve the website</li>
                <li>• Marketing cookies show you relevant content</li>
                <li>• You can control cookies through your browser settings</li>
                <li>• Affiliate cookies track referrals for commissions</li>
                <li>• Contact us with any cookie-related questions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
