import { createFileRoute } from '@tanstack/react-router'
import { IDELayout } from '../containers/IDELayout'

export const Route = createFileRoute('/ide')({
  component: IDEPage,
})

function IDEPage() {
  return <IDELayout />
}