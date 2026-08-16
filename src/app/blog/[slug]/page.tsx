import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { BLOG_POSTS } from "@/lib/data/blog";

import UluwatuPropertyInvestmentGuide2026 from "@/components/blog/posts/uluwatu-property-investment-guide-2026";
import ForeignerInvestBaliVillaLegalStructures from "@/components/blog/posts/foreigner-invest-bali-villa-legal-structures";
import UluwatuVillaRoiRealisticNumbers from "@/components/blog/posts/uluwatu-villa-roi-realistic-numbers";
import BaliVillaConstructionTimeline from "@/components/blog/posts/bali-villa-construction-timeline";
import BaliPondokWisataLicense from "@/components/blog/posts/bali-pondok-wisata-license";
import PtPmaVsLeaseholdBali from "@/components/blog/posts/pt-pma-vs-leasehold-bali";

const postComponents = {
  "uluwatu-property-investment-guide-2026": UluwatuPropertyInvestmentGuide2026,
  "foreigner-invest-bali-villa-legal-structures": ForeignerInvestBaliVillaLegalStructures,
  "uluwatu-villa-roi-realistic-numbers": UluwatuVillaRoiRealisticNumbers,
  "bali-villa-construction-timeline": BaliVillaConstructionTimeline,
  "bali-pondok-wisata-license": BaliPondokWisataLicense,
  "pt-pma-vs-leasehold-bali": PtPmaVsLeaseholdBali,
};

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return { title: "Post Not Found | Casa Bombora Blog" };
  }
  return {
    title: `${post.title} | Casa Bombora Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  const PostContent =
    postComponents[params.slug as keyof typeof postComponents];
  if (!PostContent) {
    notFound();
  }

  return (
    <ArticleLayout post={post}>
      <PostContent />
    </ArticleLayout>
  );
}
