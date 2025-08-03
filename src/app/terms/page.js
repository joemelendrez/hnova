// src/app/terms/page.js
export const metadata = {
  title: 'Terms of Service | Habit Nova',
  description:
    'Terms of Service for Habit Nova - Rules and guidelines for using our website and services.',
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="py-12 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 font-anton uppercase">
            Terms of Service
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
            <h2>1. Acceptance of Terms</h2>

            <p>
              By accessing and using the Habit Nova website (habitnova.com), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>

            <h2>2. Description of Service</h2>

            <p>Habit Nova provides:</p>
            <ul>
              <li>
                Educational content about habit formation and behavior change
              </li>
              <li>Blog articles, guides, and resources</li>
              <li>Digital products and physical merchandise</li>
              <li>Email newsletters and communications</li>
              <li>Free tools and habit trackers</li>
            </ul>

            <h2>3. User Accounts and Registration</h2>

            <h3>Account Creation</h3>
            <p>When creating an account, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Update your information when necessary</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
            </ul>

            <h3>Account Termination</h3>
            <p>We reserve the right to terminate accounts that:</p>
            <ul>
              <li>Violate these terms of service</li>
              <li>Engage in fraudulent or harmful behavior</li>
              <li>Remain inactive for extended periods</li>
            </ul>

            <h2>4. Acceptable Use Policy</h2>

            <h3>Permitted Uses</h3>
            <p>You may use our website to:</p>
            <ul>
              <li>Read and share our content for personal use</li>
              <li>Purchase products and services</li>
              <li>Participate in discussions and comments</li>
              <li>Download free resources for personal use</li>
            </ul>

            <h3>Prohibited Uses</h3>
            <p>You may not use our website to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious content</li>
              <li>Spam or send unsolicited communications</li>
              <li>Attempt to hack or compromise our systems</li>
              <li>Scrape or download content without permission</li>
              <li>Impersonate others or provide false information</li>
            </ul>

            <h2>5. Intellectual Property Rights</h2>

            <h3>Our Content</h3>
            <p>All content on Habit Nova, including but not limited to:</p>
            <ul>
              <li>Text, images, videos, and audio</li>
              <li>Logo, trademarks, and branding</li>
              <li>Software and website design</li>
              <li>Guides, templates, and resources</li>
            </ul>
            <p>
              Is protected by copyright and other intellectual property laws.
              You may not reproduce, distribute, or create derivative works
              without written permission.
            </p>

            <h3>User-Generated Content</h3>
            <p>
              When you submit content (comments, reviews, etc.), you grant us a
              non-exclusive, royalty-free license to use, modify, and display
              that content in connection with our services.
            </p>

            <h2>6. Products and Services</h2>

            <h3>Digital Products</h3>
            <ul>
              <li>Digital downloads are delivered via email</li>
              <li>No refunds on digital products unless defective</li>
              <li>Personal use license only (no redistribution)</li>
            </ul>

            <h3>Physical Products</h3>
            <ul>
              <li>Shipped via third-party carriers</li>
              <li>Return policy as stated on product pages</li>
              <li>We are not responsible for shipping delays</li>
            </ul>

            <h3>Pricing and Payment</h3>
            <ul>
              <li>Prices are subject to change without notice</li>
              <li>Payment is due at time of purchase</li>
              <li>We accept major credit cards and PayPal</li>
              <li>Sales tax may apply based on location</li>
            </ul>

            <h2>7. Affiliate Relationships</h2>

            <p>
              Habit Nova participates in affiliate marketing programs,
              including:
            </p>
            <ul>
              <li>Amazon Associates Program</li>
              <li>Various product and service partnerships</li>
            </ul>

            <p>
              When you purchase through our affiliate links, we may receive a
              commission at no additional cost to you. This does not influence
              our recommendations, which are based on our genuine opinions and
              experience.
            </p>

            <h2>8. Disclaimers and Limitations</h2>

            <h3>Educational Content</h3>
            <p>
              Our content is for educational and informational purposes only. It
              is not intended as:
            </p>
            <ul>
              <li>Medical or mental health advice</li>
              <li>Professional counseling or therapy</li>
              <li>Guaranteed results or outcomes</li>
            </ul>

            <h3>Results Disclaimer</h3>
            <p>
              Individual results may vary. Success in habit formation depends on
              many factors including personal commitment, circumstances, and
              consistency of application.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, Habit Nova shall not be
              liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use of our content or products</li>
            </ul>

            <h2>9. Privacy and Data Protection</h2>

            <p>
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your information. By using our
              services, you also agree to our Privacy Policy.
            </p>

            <h2>10. Modification of Terms</h2>

            <p>
              We reserve the right to modify these terms at any time. Changes
              will be effective when posted on this page. Continued use of our
              website after changes constitutes acceptance of the new terms.
            </p>

            <h2>11. Governing Law</h2>

            <p>
              These terms are governed by the laws of [Your State/Country]. Any
              disputes will be resolved in the courts of [Your Jurisdiction].
            </p>

            <h2>12. Contact Information</h2>

            <p>
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> legal@habitnova.com
              </li>
              <li>
                <strong>Contact Form:</strong>{' '}
                <a href="/contact" className="text-[#1a1a1a] hover:underline">
                  habitnova.com/contact
                </a>
              </li>
              <li>
                <strong>Mail:</strong> Habit Nova Legal Team, [Your Business
                Address]
              </li>
            </ul>

            <h2>13. Severability</h2>

            <p>
              If any provision of these terms is found to be unenforceable, the
              remaining provisions will continue to be valid and enforceable.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Key Points Summary</h3>
              <ul className="space-y-2 text-sm">
                <li>• Use our content respectfully and legally</li>
                <li>• Don't redistribute our copyrighted materials</li>
                <li>• Our content is educational, not professional advice</li>
                <li>• We may earn commissions from affiliate links</li>
                <li>• Individual results may vary</li>
                <li>• Contact us with any questions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
