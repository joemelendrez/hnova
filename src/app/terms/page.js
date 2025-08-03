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
      <section className="pb-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-xl max-w-none legal-content">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">1. Acceptance of Terms</h2>

            <p className="text-lg leading-relaxed mb-12">
              By accessing and using the Habit Nova website (habitnova.com), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">2. Description of Service</h2>

            <p className="text-lg leading-relaxed mb-6">Habit Nova provides:</p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                Educational content about habit formation and behavior change
              </li>
              <li>Blog articles, guides, and resources</li>
              <li>Digital products and physical merchandise</li>
              <li>Email newsletters and communications</li>
              <li>Free tools and habit trackers</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">3. User Accounts and Registration</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Account Creation</h3>
            <p className="text-lg leading-relaxed mb-6">When creating an account, you agree to:</p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Update your information when necessary</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Account Termination</h3>
            <p className="text-lg leading-relaxed mb-6">We reserve the right to terminate accounts that:</p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Violate these terms of service</li>
              <li>Engage in fraudulent or harmful behavior</li>
              <li>Remain inactive for extended periods</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">4. Acceptable Use Policy</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Permitted Uses</h3>
            <p className="text-lg leading-relaxed mb-6">You may use our website to:</p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Read and share our content for personal use</li>
              <li>Purchase products and services</li>
              <li>Participate in discussions and comments</li>
              <li>Download free resources for personal use</li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Prohibited Uses</h3>
            <p className="text-lg leading-relaxed mb-6">You may not use our website to:</p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious content</li>
              <li>Spam or send unsolicited communications</li>
              <li>Attempt to hack or compromise our systems</li>
              <li>Scrape or download content without permission</li>
              <li>Impersonate others or provide false information</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">5. Intellectual Property Rights</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Our Content</h3>
            <p className="text-lg leading-relaxed mb-6">All content on Habit Nova, including but not limited to:</p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Text, images, videos, and audio</li>
              <li>Logo, trademarks, and branding</li>
              <li>Software and website design</li>
              <li>Guides, templates, and resources</li>
            </ul>
            <p className="text-lg leading-relaxed mb-8">
              Is protected by copyright and other intellectual property laws.
              You may not reproduce, distribute, or create derivative works
              without written permission.
            </p>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">User-Generated Content</h3>
            <p className="text-lg leading-relaxed mb-12">
              When you submit content (comments, reviews, etc.), you grant us a
              non-exclusive, royalty-free license to use, modify, and display
              that content in connection with our services.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">6. Products and Services</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Digital Products</h3>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Digital downloads are delivered via email</li>
              <li>No refunds on digital products unless defective</li>
              <li>Personal use license only (no redistribution)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Physical Products</h3>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Shipped via third-party carriers</li>
              <li>Return policy as stated on product pages</li>
              <li>We are not responsible for shipping delays</li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Pricing and Payment</h3>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Prices are subject to change without notice</li>
              <li>Payment is due at time of purchase</li>
              <li>We accept major credit cards and PayPal</li>
              <li>Sales tax may apply based on location</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">7. Affiliate Relationships</h2>

            <p className="text-lg leading-relaxed mb-6">
              Habit Nova participates in affiliate marketing programs,
              including:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Amazon Associates Program</li>
              <li>Various product and service partnerships</li>
            </ul>

            <p className="text-lg leading-relaxed mb-12">
              When you purchase through our affiliate links, we may receive a
              commission at no additional cost to you. This does not influence
              our recommendations, which are based on our genuine opinions and
              experience.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">8. Disclaimers and Limitations</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Educational Content</h3>
            <p className="text-lg leading-relaxed mb-6">
              Our content is for educational and informational purposes only. It
              is not intended as:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Medical or mental health advice</li>
              <li>Professional counseling or therapy</li>
              <li>Guaranteed results or outcomes</li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Results Disclaimer</h3>
            <p className="text-lg leading-relaxed mb-8">
              Individual results may vary. Success in habit formation depends on
              many factors including personal commitment, circumstances, and
              consistency of application.
            </p>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Limitation of Liability</h3>
            <p className="text-lg leading-relaxed mb-6">
              To the fullest extent permitted by law, Habit Nova shall not be
              liable for:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use of our content or products</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">9. Privacy and Data Protection</h2>

            <p className="text-lg leading-relaxed mb-12">
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your information. By using our
              services, you also agree to our Privacy Policy.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">10. Modification of Terms</h2>

            <p className="text-lg leading-relaxed mb-12">
              We reserve the right to modify these terms at any time. Changes
              will be effective when posted on this page. Continued use of our
              website after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">11. Governing Law</h2>

            <p className="text-lg leading-relaxed mb-12">
              These terms are governed by the laws of [Your State/Country]. Any
              disputes will be resolved in the courts of [Your Jurisdiction].
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">12. Contact Information</h2>

            <p className="text-lg leading-relaxed mb-6">
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>
                <strong>Email:</strong> legal@habitnova.com
              </li>
              <li>
                <strong>Contact Form:</strong>{' '}
                <a href="/contact" className="text-[#1a1a1a] hover:underline font-medium">
                  habitnova.com/contact
                </a>
              </li>
              <li>
                <strong>Mail:</strong> Habit Nova Legal Team, [Your Business
                Address]
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">13. Severability</h2>

            <p className="text-lg leading-relaxed mb-12">
              If any provision of these terms is found to be unenforceable, the
              remaining provisions will continue to be valid and enforceable.
            </p>

            <div className="mt-16 p-8 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-6">Key Points Summary</h3>
              <ul className="space-y-4 text-lg leading-relaxed">
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