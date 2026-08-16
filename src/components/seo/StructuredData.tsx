export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://casabombora.com/#organization",
        name: "Casa Bombora",
        url: "https://casabombora.com",
        logo: "https://casabombora.com/images/backgrounds/Hero_bg.desktop.webp",
        image: "https://casabombora.com/images/backgrounds/Hero_bg.desktop.webp",
        description:
          "End-to-end luxury villa investment and management in Uluwatu, Bali. From land acquisition to construction and property management.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Uluwatu",
          addressRegion: "Bali",
          addressCountry: "ID",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+61-415-164-208",
            email: "info@casabombora.com",
            contactType: "Customer Service",
            availableLanguage: ["English"],
          },
        ],
        priceRange: "$$$",
      },
      {
        "@type": "WebSite",
        "@id": "https://casabombora.com/#website",
        url: "https://casabombora.com",
        name: "Casa Bombora",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://casabombora.com/blog?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
