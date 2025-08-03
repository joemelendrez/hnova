// src/app/privacy/page.js
export const metadata = {
  title: 'Privacy Policy | Habit Nova',
  description:
    'Privacy Policy for Habit Nova - How we collect, use, and protect your personal information.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="py-12 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 font-anton uppercase">
            Privacy Policy
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
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">1. Information We Collect</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Personal Information</h3>
            <p className="text-lg leading-relaxed mb-6">
              We collect information you provide directly to us, such as when
              you:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Subscribe to our newsletter or email list</li>
              <li>Create an account or make a purchase</li>
              <li>Contact us through our contact form</li>
              <li>Download our free guides or resources</li>
              <li>Comment on our blog posts</li>
              <li>Participate in surveys or contests</li>
            </ul>

            <p className="text-lg leading-relaxed mb-6">This information may include:</p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Name and email address</li>
              <li>Billing and shipping information</li>
              <li>Phone number</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Automatically Collected Information</h3>
            <p className="text-lg leading-relaxed mb-6">
              We automatically collect certain information when you visit our
              website:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>IP address and browser type</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website or search terms</li>
              <li>Device information and operating system</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">2. How We Use Your Information</h2>

            <p className="text-lg leading-relaxed mb-6">We use the information we collect to:</p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Provide, maintain, and improve our services</li>
              <li>
                Send you newsletters, marketing communications, and updates
              </li>
              <li>Process transactions and send purchase confirmations</li>
              <li>
                Respond to your comments, questions, and customer service
                requests
              </li>
              <li>Analyze website usage and improve user experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure website security</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">3. Information Sharing and Disclosure</h2>

            <p className="text-lg leading-relaxed mb-8">We may share your information with:</p>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Service Providers</h3>
            <p className="text-lg leading-relaxed mb-6">
              We work with third-party companies that help us operate our
              business:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>
                <strong>Email Marketing:</strong> Mailchimp, ConvertKit (for
                newsletters)
              </li>
              <li>
                <strong>Analytics:</strong> Google Analytics (for website
                analysis)
              </li>
              <li>
                <strong>E-commerce:</strong> Shopify (for processing orders)
              </li>
              <li>
                <strong>Payment Processing:</strong> Stripe, PayPal (for
                payments)
              </li>
              <li>
                <strong>Customer Support:</strong> Various tools for managing
                inquiries
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Affiliate Partners</h3>
            <p className="text-lg leading-relaxed mb-8">
              We participate in affiliate marketing programs, including Amazon
              Associates. When you click on affiliate links and make purchases,
              we may receive commissions. This does not affect the price you
              pay.
            </p>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Legal Requirements</h3>
            <p className="text-lg leading-relaxed mb-6">We may disclose your information if required by law or to:</p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Comply with legal processes</li>
              <li>Protect our rights and property</li>
              <li>Ensure user safety</li>
              <li>Investigate potential violations</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">4. Cookies and Tracking Technologies</h2>

            <p className="text-lg leading-relaxed mb-6">We use cookies and similar technologies to:</p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Provide personalized content and advertising</li>
              <li>Enable social media features</li>
              <li>Track affiliate commissions</li>
            </ul>

            <p className="text-lg leading-relaxed mb-12">
              You can control cookies through your browser settings. However,
              disabling cookies may limit some website functionality.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">5. Data Security</h2>

            <p className="text-lg leading-relaxed mb-6">
              We implement appropriate security measures to protect your
              personal information:
            </p>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited access to personal information</li>
              <li>Employee training on data protection</li>
            </ul>

            <p className="text-lg leading-relaxed mb-12">
              However, no internet transmission is 100% secure. We cannot
              guarantee absolute security.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">6. Your Rights and Choices</h2>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Email Communications</h3>
            <ul className="text-lg leading-relaxed mb-8 space-y-3">
              <li>Unsubscribe from marketing emails at any time</li>
              <li>Update your email preferences</li>
              <li>Request to be removed from our mailing list</li>
            </ul>

            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6 mt-12">Data Access and Control</h3>
            <p className="text-lg leading-relaxed mb-6">You have the right to:</p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Access your personal information</li>
              <li>Correct or update your information</li>
              <li>Request deletion of your data</li>
              <li>Object to certain processing activities</li>
              <li>Receive a copy of your data</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">7. Children's Privacy</h2>

            <p className="text-lg leading-relaxed mb-12">
              Our website is not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              we become aware that we have collected such information, we will
              delete it immediately.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">8. International Users</h2>

            <p className="text-lg leading-relaxed mb-12">
              Our website is operated from the United States. If you are
              accessing our site from outside the US, your information may be
              transferred to, stored, and processed in the United States. By
              using our website, you consent to this transfer.
            </p>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">9. Changes to This Privacy Policy</h2>

            <p className="text-lg leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email notification for significant changes</li>
            </ul>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 mt-16">10. Contact Us</h2>

            <p className="text-lg leading-relaxed mb-6">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <ul className="text-lg leading-relaxed mb-12 space-y-3">
              <li>
                <strong>Email:</strong> privacy@habitnova.com
              </li>
              <li>
                <strong>Contact Form:</strong>{' '}
                <a href="/contact" className="text-[#1a1a1a] hover:underline font-medium">
                  habitnova.com/contact
                </a>
              </li>
              <li>
                <strong>Mail:</strong> Habit Nova Privacy Team, [Your Business
                Address]
              </li>
            </ul>

            <div className="mt-16 p-8 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-6">Quick Summary</h3>
              <ul className="space-y-4 text-lg leading-relaxed">
                <li>• We collect information you provide and usage data</li>
                <li>
                  • We use it to improve our services and communicate with you
                </li>
                <li>
                  • We share data with service providers and affiliate partners
                </li>
                <li>• You can control your data and unsubscribe anytime</li>
                <li>• We protect your information with security measures</li>
                <li>• Contact us with any privacy questions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}