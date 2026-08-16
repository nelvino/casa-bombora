import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BlogPost } from "@/lib/data/blog";

interface ArticleLayoutProps {
  post: BlogPost;
  children: React.ReactNode;
}

export function ArticleLayout({ post, children }: ArticleLayoutProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Casa Bombora",
      logo: {
        "@type": "ImageObject",
        url: "/images/logos/Casa_bombora_LOGO.svg",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: post.image ?? "",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://casabombora.com/blog/${post.slug}`,
    },
  };

  return (
    <Container size="small" className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mb-8">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm font-medium text-gunmetal/70 transition-colors hover:text-blue-green"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to all insights
        </Link>
      </div>

      <header className="mb-12 text-center">
        <span className="inline-block rounded-full bg-blue-green/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-green">
          {post.category}
        </span>
        <h1 className="mt-4 font-serif text-3xl font-medium text-gunmetal md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-gunmetal/70">
          {publishedDate} &middot; {post.readingTime} read &middot; By{" "}
          {post.author}
        </p>
      </header>

      <article
        className="max-w-none
          [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-gunmetal
          [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-gunmetal/90
          [&_p]:mb-5 [&_p]:font-sans [&_p]:leading-relaxed [&_p]:text-gunmetal/90
          [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:font-sans [&_ul]:text-gunmetal/90
          [&_li]:mb-2 [&_li]:leading-relaxed
          [&_a]:text-blue-green [&_a]:underline
          [&_aside]:my-8 [&_aside]:rounded-md [&_aside]:border-l-4 [&_aside]:border-lion [&_aside]:bg-lion/10 [&_aside]:p-5 [&_aside]:font-sans [&_aside]:text-gunmetal/90
        "
      >
        {children}
      </article>

      <div className="mt-16 rounded-lg bg-gunmetal/5 p-8 text-center">
        <p className="mb-6 font-serif text-2xl text-gunmetal">
          Ready to discuss your Uluwatu villa investment?
        </p>
        <a href="/#contact" className="inline-block">
          <Button variant="secondary" size="lg">
            Talk to an Investment Specialist
          </Button>
        </a>
      </div>
    </Container>
  );
}
