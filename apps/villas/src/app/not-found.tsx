import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="mb-4">Page not found</h1>
      <p className="mb-8 text-gunmetal/70">
        We could not find the page you were looking for.
      </p>
      <Link href="/" className="text-blue-green hover:text-blue-green/80">
        Return home
      </Link>
    </Container>
  )
}
