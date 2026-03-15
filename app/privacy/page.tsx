import React from "react";

export default function PrivacyPage() {
  return (
    <main className="container max-w-3xl py-20">
      <h1 className="text-3xl font-bold mb-8">Mailvanta Privacy Policy</h1>
      <p className="mb-4 text-muted-foreground">
        Effective Date: June 15, 2026
      </p>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">Who we are</h2>
        <p>
          Mailvanta is an email marketing platform owned and operated by Chirag Dodiya. We’re committed to safeguarding your privacy and respecting your data rights.
        </p>
        <p className="mt-2 text-muted-foreground">
          If you have questions, please contact us at <a className="underline text-primary" href="mailto:hi@chirag.co">hi@chirag.co</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">Information we collect</h2>
        <ul className="list-disc ml-6">
          <li>Your email address and name when you request access, sign up, or subscribe to updates.</li>
          <li>Usage data including IP, device/browser information, and activity logs.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">How we use your information</h2>
        <ul className="list-disc ml-6">
          <li>To provide our email marketing SaaS features.</li>
          <li>To communicate about product updates or access requests.</li>
          <li>For analytics and improvement of our platform.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">How your information is protected</h2>
        <p>
          We use security best practices to store your data, including encryption in transit and limited access. Data is never sold or shared beyond service delivery or legal requirements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">Your choices</h2>
        <ul className="list-disc ml-6">
          <li>You may request or delete your data at any time by contacting <a className="underline text-primary" href="mailto:hi@chirag.co">hi@chirag.co</a>.</li>
          <li>You can unsubscribe from our communications at any time.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">Changes</h2>
        <p>
          We may update this privacy policy as our product evolves. Any change will be posted on this page and, if significant, via email update.
        </p>
      </section>

      <footer className="text-muted-foreground pt-8 border-t mt-16">
        &copy; 2026 Mailvanta | Owner: Chirag Dodiya (&lt;hi@chirag.co&gt;)
      </footer>
    </main>
  );
}