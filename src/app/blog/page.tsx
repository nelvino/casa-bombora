import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BLOG_POSTS } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Casa Bombora Blog | Bali Villa Investment Insights",
  description:
    "Market reports, ROI analysis, legal guides, and construction timelines for investing in luxury Uluwatu, Bali villas.",
};

export default function BlogPage() {
  return (
    <Container size="default" className="py-16 md:py-24">
      <div className="mb-8">
        <Link
          href="/"
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
          Back to Casa Bombora
        </Link>
      </div>

      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-gunmetal md:text-5xl">
          Bali Villa Investment Insights
        </h1>
        <p className="mt-4 text-gunmetal/80">
          Practical guides for investors in Uluwatu and beyond.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-gunmetal/5">
              {post.image ? (
                <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : null}
            </div>
            <div className="p-6">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-green">
                {post.category}
              </span>
              <h2 className="mt-2 font-serif text-xl text-gunmetal transition group-hover:text-blue-green">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-gunmetal/70">
                {post.description}
              </p>
              <p className="mt-4 text-xs text-gunmetal/50">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}{" "}
                &middot; {post.readingTime} read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
