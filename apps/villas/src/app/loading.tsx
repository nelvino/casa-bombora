import { Container } from '@/components/ui/Container'

export default function Loading() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gunmetal/20 border-t-blue-green" />
      <p className="text-gunmetal/70">Loading Casa Bombora Villas&hellip;</p>
    </Container>
  )
}
