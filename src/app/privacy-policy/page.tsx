import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Casa Bombora privacy policy explains how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-alabaster/10 py-16">
      <Container size="small">
        <h1 className="mb-6 font-serif text-3xl text-gunmetal md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mb-4 text-gunmetal/80">
          Casa Bombora ("we", "our" or "us") is committed to protecting your
          privacy. This policy explains how we collect, use, and safeguard
          personal information when you visit our website or contact us.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Information we collect
        </h2>
        <p className="mb-4 text-gunmetal/80">
          When you complete the contact form, we may collect your name, email
          address, phone number, and the message you send. We collect this
          information only when you voluntarily provide it.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          How we use your information
        </h2>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-gunmetal/80">
          <li>To respond to your enquiries and provide investment information.</li>
          <li>To send occasional newsletters or updates if you have opted in.</li>
          <li>To improve our website, services, and customer experience.</li>
        </ul>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          How we protect your information
        </h2>
        <p className="mb-4 text-gunmetal/80">
          We take reasonable steps to keep your information secure and do not
          sell, trade, or rent your personal details to third parties.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Cookies and analytics
        </h2>
        <p className="mb-4 text-gunmetal/80">
          We may use cookies and analytics tools to understand how visitors use
          our website. You can disable cookies through your browser settings.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Third-party links
        </h2>
        <p className="mb-4 text-gunmetal/80">
          Our website may contain links to external sites. We are not responsible
          for the privacy practices or content of those sites.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Your rights
        </h2>
        <p className="mb-4 text-gunmetal/80">
          You can ask us to access, correct, or delete your personal information
          at any time by emailing{" "}
          <a
            href="mailto:info@casabombora.com"
            className="text-blue-green hover:underline"
          >
            info@casabombora.com
          </a>
          .
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Changes to this policy
        </h2>
        <p className="mb-8 text-gunmetal/80">
          We may update this policy from time to time. Any changes will be posted
          on this page.
        </p>

        <p className="text-gunmetal/80">
          If you have any questions, please{" "}
          <Link href="/#contact" className="text-blue-green hover:underline">
            contact us
          </Link>
          .
        </p>
      </Container>
    </main>
  );
}
