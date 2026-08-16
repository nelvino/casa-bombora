export function ProductJsonLd({
  name,
  description,
  image,
  url,
}: {
  name: string;
  description: string;
  image: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    brand: {
      "@type": "Brand",
      name: "Casa Bombora",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      price: "0",
      priceValidUntil: new Date().toISOString().split("T")[0],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
