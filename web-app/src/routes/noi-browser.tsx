import { createFileRoute } from '@tanstack/react-router'
import { NoiBrowser } from '../components/NoiBrowser'

export const Route = createFileRoute('/noi-browser')({
  component: NoiBrowserPage,
})

function NoiBrowserPage() {
  return <NoiBrowser />
}