import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="mb-2 font-serif text-6xl text-gunmetal/20">404</p>
      <h1 className="mb-4 text-gunmetal">Page not found</h1>
      <p className="mb-8 text-gunmetal/70">
        We could not find the page you were looking for. Let us help you back to the villas.
      </p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </Container>
  )
}
