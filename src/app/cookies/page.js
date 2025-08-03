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
            Cookie Policy
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2>1. What Are Cookies?</h2>

            <p>
              Cookies are small text files that are stored on your device when
              you visit our website. They help us provide you with a better
              browsing experience by remembering your preferences and analyzing
              how you use our site.
            </p>

            <h2>2. How We Use Cookies</h2>

            <p>We use cookies for several purposes:</p>
            <ul>
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

            <h2>3. Types of Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cookie Name</th>
                    <th className="text-left p-2">Purpose</th>
                    <th className="text-left p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">session_id</td>
                    <td className="p-2">Maintain user session</td>
                    <td className="p-2">Session</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">cart_contents</td>
                    <td className="p-2">Remember shopping cart items</td>
                    <td className="p-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="p-2">cookie_consent</td>
                    <td className="p-2">Remember your cookie preferences</td>
                    <td className="p-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Analytics Cookies</h3>
            <p>We use analytics services to understand website usage:</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Cookies</th>
                    <th className="text-left p-2">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Google Analytics</td>
                    <td className="p-2">_ga, _ga_*, _gid</td>
                    <td className="p-2">Track website usage and performance</td>
                  </tr>
                  <tr>
                    <td className="p-2">Hotjar</td>
                    <td className="p-2">_hjid, _hjSessionUser_*</td>
                    <td className="p-2">User behavior analysis and heatmaps</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Marketing and Advertising Cookies</h3>
            <p>
              These cookies help us show relevant content and track marketing
              effectiveness:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Purpose</th>
                    <th className="text-left p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Facebook Pixel</td>
                    <td className="p-2">Track conversions and retargeting</td>
                    <td className="p-2">90 days</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Google Ads</td>
                    <td className="p-2">Measure ad performance</td>
                    <td className="p-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="p-2">Email Marketing</td>
                    <td className="p-2">Track email campaign effectiveness</td>
                    <td className="p-2">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Affiliate Tracking Cookies</h3>
            <p>We use affiliate cookies to track referrals and commissions:</p>
            <ul>
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

            <h2>4. Third-Party Cookies</h2>

            <p>Some cookies are set by third-party services we use:</p>

            <h3>Social Media</h3>
            <ul>
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

            <h3>E-commerce</h3>
            <ul>
              <li>
                <strong>Shopify:</strong> For our online store functionality
              </li>
              <li>
                <strong>Stripe/PayPal:</strong> For payment processing
              </li>
            </ul>

            <h3>Email Marketing</h3>
            <ul>
              <li>
                <strong>Mailchimp:</strong> For newsletter and email campaigns
              </li>
              <li>
                <strong>ConvertKit:</strong> For marketing automation
              </li>
            </ul>

            <h2>5. Managing Your Cookie Preferences</h2>

            <h3>Browser Settings</h3>
            <p>You can control cookies through your browser settings:</p>
            <ul>
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

            <h3>Opt-Out Links</h3>
            <p>You can opt out of specific tracking services:</p>
            <ul>
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener"
                  className="text-[#1a1a1a] hover:underline"
                >
                  Google Analytics Opt-out
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/settings?tab=ads"
                  target="_blank"
                  rel="noopener"
                  className="text-[#1a1a1a] hover:underline"
                >
                  Facebook Ad Preferences
                </a>
              </li>
              <li>
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener"
                  className="text-[#1a1a1a] hover:underline"
                >
                  Digital Advertising Alliance Opt-out
                </a>
              </li>
            </ul>

            <h3>Our Cookie Preference Center</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm mb-3">
                Manage your cookie preferences for this website:
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" checked disabled className="mr-2" />
                  <span className="text-sm">Essential Cookies (Required)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Analytics Cookies</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Marketing Cookies</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Affiliate Tracking Cookies</span>
                </label>
              </div>
              <button className="mt-3 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                Save Preferences
              </button>
            </div>

            <h2>6. Impact of Disabling Cookies</h2>

            <p>
              If you disable cookies, some website features may not work
              properly:
            </p>
            <ul>
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

            <h2>7. Cookie Lifespan</h2>

            <p>Different cookies have different lifespans:</p>
            <ul>
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

            <h2>8. Updates to This Policy</h2>

            <p>We may update this Cookie Policy to reflect changes in:</p>
            <ul>
              <li>Our use of cookies</li>
              <li>Legal requirements</li>
              <li>Third-party services we use</li>
            </ul>

            <p>
              We will notify you of significant changes by updating the "Last
              updated" date and posting the new policy on our website.
            </p>

            <h2>9. Contact Us</h2>

            <p>
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> privacy@habitnova.com
              </li>
              <li>
                <strong>Contact Form:</strong>{' '}
                <a href="/contact" className="text-[#1a1a1a] hover:underline">
                  habitnova.com/contact
                </a>
              </li>
            </ul>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Quick Cookie Guide</h3>
              <ul className="space-y-2 text-sm">
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
