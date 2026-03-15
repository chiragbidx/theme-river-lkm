import React from "react";

export default function TermsOfServicePage() {
  return (
    <main className="container max-w-3xl py-20">
      <h1 className="text-3xl font-bold mb-8">Mailvanta Terms of Service</h1>
      <p className="mb-4 text-muted-foreground">
        Effective Date: June 15, 2026
      </p>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Mailvanta, you agree to these Terms of Service and our Privacy Policy.
          If you do not agree, do not use the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">2. Description of Service</h2>
        <p>
          Mailvanta is an email marketing platform for sending campaigns, managing lists, and gaining insights for your business. The service is provided by Chirag Dodiya.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">3. User Accounts</h2>
        <ul className="list-disc ml-6">
          <li>All account information must be accurate and kept up to date.</li>
          <li>User is responsible for keeping access credentials confidential.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">4. Acceptable Use</h2>
        <ul className="list-disc ml-6">
          <li>No sending spam or illegal content through the platform.</li>
          <li>No attempts to disrupt, hack, or damage the service or others’ use of it.</li>
          <li>Use of the service must comply with all applicable laws.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts for violating these terms or abusing the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">6. Liability Disclaimer</h2>
        <p>
          Mailvanta is provided “as is” without warranties. We are not liable for indirect, incidental, or consequential damages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">7. Contact Information</h2>
        <p>
          If you have questions or need help, contact Chirag Dodiya at <a href="mailto:hi@chirag.co" className="text-primary underline">hi@chirag.co</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">8. Changes</h2>
        <p>
          We may update these terms when necessary. Material changes will be notified via the website or email.
        </p>
      </section>

      <footer className="text-muted-foreground pt-8 border-t mt-16">
        &copy; 2026 Mailvanta | Owner: Chirag Dodiya (&lt;hi@chirag.co&gt;)
      </footer>
    </main>
  );
}