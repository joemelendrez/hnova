// src/app/affiliate-disclosure/page.js
export const metadata = {
  title: 'Affiliate Disclosure | Habit Nova',
  description:
    'Affiliate Disclosure for Habit Nova - Transparency about our affiliate relationships and commissions.',
  robots: 'index, follow',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="py-12 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 font-anton uppercase">
            Affiliate Disclosure
          </h1>
          <p className="text-xl text-gray-200">
            Transparency about our affiliate relationships and recommendations
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Important Disclosure
              </h3>
              <p className="text-blue-800">
                Habit Nova participates in affiliate marketing programs. This
                means we may earn commissions when you purchase products through
                our links, at no additional cost to you. We only recommend
                products and services we genuinely believe will benefit our
                readers.
              </p>
            </div>

            <h2>1. What Are Affiliate Links?</h2>

            <p>
              Affiliate links are special tracking links that allow companies to
              identify when a sale comes from our website. When you click on an
              affiliate link and make a purchase, we may receive a small
              commission from the company.
            </p>

            <p>
              <strong>Important:</strong> Using affiliate links does not cost
              you anything extra. The price you pay is exactly the same whether
              you use our link or go directly to the company's website.
            </p>

            <h2>2. Our Affiliate Partners</h2>

            <h3>Amazon Associates Program</h3>
            <p>
              Habit Nova is a participant in the Amazon Services LLC Associates
              Program, an affiliate advertising program designed to provide a
              means for sites to earn advertising fees by advertising and
              linking to Amazon.com.
            </p>

            <p>
              This means that when you click on certain links to Amazon products
              on our website and make a purchase, we may receive a small
              commission. Products we link to on Amazon include:
            </p>
            <ul>
              <li>Books on habit formation and psychology</li>
              <li>Journals and planners for habit tracking</li>
              <li>Productivity tools and accessories</li>
              <li>Wellness and mindfulness products</li>
              <li>Organizational and time management tools</li>
            </ul>

            <h3>Other Affiliate Programs</h3>
            <p>We also participate in affiliate programs with:</p>
            <ul>
              <li>
                <strong>Course Platforms:</strong> Udemy, Coursera, MasterClass
              </li>
              <li>
                <strong>Productivity Tools:</strong> Notion, Todoist, Evernote
              </li>
              <li>
                <strong>Wellness Apps:</strong> Headspace, Calm, Insight Timer
              </li>
              <li>
                <strong>Book Retailers:</strong> Barnes & Noble, Book Depository
              </li>
              <li>
                <strong>Software Services:</strong> Various productivity and
                habit tracking apps
              </li>
              <li>
                <strong>Physical Products:</strong> Journals, planners, and
                wellness products
              </li>
            </ul>

            <h2>3. Our Recommendation Policy</h2>

            <h3>Genuine Recommendations Only</h3>
            <p>We maintain strict standards for our recommendations:</p>
            <ul>
              <li>
                <strong>Personal Use:</strong> We only recommend products we've
                personally used or thoroughly researched
              </li>
              <li>
                <strong>Value-First:</strong> We consider whether the product
                genuinely helps with habit formation
              </li>
              <li>
                <strong>Quality Standards:</strong> We evaluate products based
                on effectiveness, user reviews, and scientific backing
              </li>
              <li>
                <strong>Honest Reviews:</strong> We share both positive and
                negative aspects of products
              </li>
            </ul>

            <h3>Editorial Independence</h3>
            <p>
              Our affiliate relationships do not influence our editorial
              content:
            </p>
            <ul>
              <li>We write honest reviews and opinions</li>
              <li>Affiliate commissions do not affect our recommendations</li>
              <li>We clearly mark sponsored content when applicable</li>
              <li>
                Our primary goal is helping readers, not earning commissions
              </li>
            </ul>

            <h2>4. How We Use Affiliate Income</h2>

            <p>Revenue from affiliate partnerships helps us:</p>
            <ul>
              <li>
                <strong>Create Free Content:</strong> Fund research and writing
                of blog articles
              </li>
              <li>
                <strong>Maintain the Website:</strong> Cover hosting, security,
                and technical costs
              </li>
              <li>
                <strong>Develop Resources:</strong> Create free habit trackers,
                guides, and tools
              </li>
              <li>
                <strong>Invest in Quality:</strong> Purchase products for
                testing and review
              </li>
              <li>
                <strong>Grow Our Team:</strong> Bring in experts to create
                better content
              </li>
            </ul>

            <h2>5. Identifying Affiliate Links</h2>

            <h3>Clear Disclosure</h3>
            <p>We clearly identify affiliate content through:</p>
            <ul>
              <li>
                <strong>Disclosure Statements:</strong> Written notices near
                affiliate links
              </li>
              <li>
                <strong>Visual Indicators:</strong> Special styling or icons for
                affiliate links
              </li>
              <li>
                <strong>Article Disclaimers:</strong> Notices at the beginning
                or end of posts
              </li>
              <li>
                <strong>Product Reviews:</strong> Clear statements in review
                articles
              </li>
            </ul>

            <h3>Common Disclosure Language</h3>
            <p>You may see these phrases indicating affiliate relationships:</p>
            <ul>
              <li>"This post contains affiliate links"</li>
              <li>
                "We may earn a commission from purchases made through these
                links"
              </li>
              <li>
                "As an Amazon Associate, we earn from qualifying purchases"
              </li>
              <li>"Affiliate link" or "Sponsored link"</li>
            </ul>

            <h2>6. Your Rights as a Reader</h2>

            <h3>No Obligation</h3>
            <ul>
              <li>You are never obligated to purchase through our links</li>
              <li>You can find products independently if you prefer</li>
              <li>Our content provides value regardless of purchases</li>
            </ul>

            <h3>Price Transparency</h3>
            <ul>
              <li>Affiliate links do not increase your costs</li>
              <li>You'll see the same prices as direct customers</li>
              <li>Sale prices and discounts still apply</li>
            </ul>

            <h2>7. Product Testing and Reviews</h2>

            <h3>Our Review Process</h3>
            <p>When reviewing products, we:</p>
            <ul>
              <li>
                <strong>Test Personally:</strong> Use products for sufficient
                time to form opinions
              </li>
              <li>
                <strong>Research Thoroughly:</strong> Study product
                specifications and user feedback
              </li>
              <li>
                <strong>Compare Options:</strong> Evaluate alternatives and
                competitive products
              </li>
              <li>
                <strong>Consider Value:</strong> Assess cost-effectiveness and
                practical benefits
              </li>
              <li>
                <strong>Share Honestly:</strong> Report both strengths and
                weaknesses
              </li>
            </ul>

            <h3>Review Standards</h3>
            <ul>
              <li>We never guarantee specific results from any product</li>
              <li>Individual experiences may vary</li>
              <li>We encourage reading multiple reviews before purchasing</li>
              <li>
                Return policies and guarantees are set by the manufacturer
              </li>
            </ul>

            <h2>8. FTC Compliance</h2>

            <p>
              We comply with Federal Trade Commission (FTC) guidelines regarding
              affiliate marketing:
            </p>
            <ul>
              <li>
                <strong>Material Connection:</strong> We disclose all affiliate
                relationships
              </li>
              <li>
                <strong>Clear Disclosure:</strong> Affiliations are mentioned
                prominently
              </li>
              <li>
                <strong>Honest Opinions:</strong> Our recommendations reflect
                genuine beliefs
              </li>
              <li>
                <strong>Consumer Protection:</strong> We prioritize reader
                interests
              </li>
            </ul>

            <h2>9. International Considerations</h2>

            <p>For international readers:</p>
            <ul>
              <li>Affiliate programs may vary by country</li>
              <li>Some links may not work outside the US</li>
              <li>Local alternatives may be available</li>
              <li>Currency and shipping costs may differ</li>
            </ul>

            <h2>10. Contact Us About Affiliates</h2>

            <p>If you have questions about our affiliate relationships:</p>
            <ul>
              <li>
                <strong>Email:</strong> affiliates@habitnova.com
              </li>
              <li>
                <strong>General Contact:</strong>{' '}
                <a href="/contact" className="text-[#1a1a1a] hover:underline">
                  habitnova.com/contact
                </a>
              </li>
              <li>
                <strong>Feedback:</strong> We welcome your thoughts on our
                recommendations
              </li>
            </ul>

            <h2>11. Changes to This Disclosure</h2>

            <p>We may update this disclosure to reflect:</p>
            <ul>
              <li>New affiliate partnerships</li>
              <li>Changes in FTC guidelines</li>
              <li>Updates to our policies</li>
            </ul>

            <p>
              Significant changes will be noted with an updated "Last modified"
              date.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Our Commitment to You
              </h3>
              <p className="text-sm mb-3">
                We believe in complete transparency about our affiliate
                relationships. Our goal is to help you build better habits, and
                any commissions we earn help us continue creating valuable, free
                content for our community.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• We only recommend products we genuinely believe in</li>
                <li>• Affiliate links never cost you extra money</li>
                <li>• Our reviews are honest and unbiased</li>
                <li>• Your trust is more valuable than any commission</li>
                <li>• We're here to help you succeed, not just make sales</li>
              </ul>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Last Updated:</strong>{' '}
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
