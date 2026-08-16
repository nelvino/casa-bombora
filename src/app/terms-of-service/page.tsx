import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Casa Bombora terms of service outline the rules and conditions for using our website and services.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-alabaster/10 py-16">
      <Container size="small">
        <h1 className="mb-6 font-serif text-3xl text-gunmetal md:text-4xl">
          Terms of Service
        </h1>
        <p className="mb-4 text-gunmetal/80">
          These terms govern your use of the Casa Bombora website and any
          enquiry you submit through it. By using this site, you accept these
          terms.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Use of the website
        </h2>
        <p className="mb-4 text-gunmetal/80">
          The content on this site is for informational purposes only. It does
          not constitute legal, financial, or investment advice. You should
          consult qualified professionals before making any investment
          decision.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Investment and ROI information
        </h2>
        <p className="mb-4 text-gunmetal/80">
          Any projected returns, occupancy rates, or yield figures are
          estimates based on market assumptions. Past performance and projected
          figures are not guarantees of future results.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Intellectual property
        </h2>
        <p className="mb-4 text-gunmetal/80">
          All text, images, designs, and other materials on this site are owned
          by or licensed to Casa Bombora. You may not reproduce, distribute, or
          use them without our prior written consent.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Enquiries and communication
        </h2>
        <p className="mb-4 text-gunmetal/80">
          Submitting a contact form does not create a contract or client
          relationship. We will respond to genuine enquiries as soon as
          practicable.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Limitation of liability
        </h2>
        <p className="mb-4 text-gunmetal/80">
          To the extent permitted by law, Casa Bombora is not liable for any
          loss or damage arising from your use of this site or reliance on its
          content.
        </p>

        <h2 className="mb-3 mt-8 font-serif text-2xl text-gunmetal">
          Governing law
        </h2>
        <p className="mb-8 text-gunmetal/80">
          These terms are governed by the laws of the Republic of Indonesia.
          Any disputes will be resolved in the appropriate courts of Indonesia.
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
