"use client";

import { Container } from "@/components/ui/Container";

const faqs = [
  {
    question: "What is Casa Bombora?",
    answer:
      "Casa Bombora is an end-to-end villa investment and management company in Uluwatu, Bali. We help investors find land, handle legal and permits, design and build the villa, and then manage it for rental income.",
  },
  {
    question: "How much do I need to invest in a Casa Bombora villa?",
    answer:
      "Project costs depend on the villa type. Our 1 Level Villa starts around USD 110,000, the Mezzanine Villa around USD 130,000, and the 2 Levels Villa around USD 160,000. These are build-ready investment estimates and vary with final finishes and land terms.",
  },
  {
    question: "What ROI can I realistically expect?",
    answer:
      "We typically project an annual ROI of 18–28% before tax, depending on villa type, occupancy, nightly rate, and management costs. The on-site ROI calculator lets you model different scenarios in real time.",
  },
  {
    question: "Can foreigners own land or a villa in Bali?",
    answer:
      "Foreigners cannot hold freehold title (Hak Milik). The most common structures are long-term leasehold (Hak Sewa), a foreign-owned PT PMA company, or Hak Pakai for residential use. We guide you through the right option for your investment.",
  },
  {
    question: "How long does it take to build a villa in Bali?",
    answer:
      "A typical Casa Bombora villa is built in about 12 months from completed land due diligence to handover. This includes design, permits, construction, interior fit-out, and final inspection.",
  },
  {
    question: "Do you handle all legal work and permits?",
    answer:
      "Yes. Our legal services cover land checks, notary review, lease agreements, company formation, and the permits required to build and operate a short-term rental villa.",
  },
  {
    question: "What is a Pondok Wisata license?",
    answer:
      "Pondok Wisata is the Indonesian short-term rental operating license. It is required to list and run a villa on platforms such as Airbnb and Booking.com. We help ensure your project is designed to meet licensing requirements.",
  },
  {
    question: "Do you manage the villa after it is completed?",
    answer:
      "Yes. Our property management service handles guest bookings, housekeeping, maintenance, marketing, and reporting. The goal is to maximise occupancy and keep the asset in excellent condition.",
  },
  {
    question: "Where are the villas located?",
    answer:
      "Our projects are in Petjatu, Uluwatu, on the Bukit Peninsula in southern Bali. The area is known for its clifftop views, surf breaks, and growing demand from premium travellers.",
  },
  {
    question: "How do I get started?",
    answer:
      "Send a message through the contact form or click the WhatsApp button. We will arrange a free investment call to walk you through the process, ownership options, and projected numbers.",
  },
];

function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQ() {
  return (
    <section id="faq" className="bg-alabaster py-10 md:py-20">
      <FaqJsonLd />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-gunmetal md:text-4xl">
            Frequently Asked{" "}
            <span className="text-blue-green">Questions</span>
          </h2>
          <p className="mt-4 text-gunmetal/80">
            Quick answers to the most common questions about investing in a
            Casa Bombora villa.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-gunmetal/10 bg-white px-6 py-5 open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg font-medium text-gunmetal">
                {faq.question}
                <span className="ml-4 text-blue-green transition group-open:rotate-180">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gunmetal/80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
