import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  subtitle?: string
  redirectInitial?: boolean
}

const EmptyState = ({ title, subtitle, redirectInitial }: EmptyStateProps) => {
  return (
    <div className="container flex flex-col text-foreground">
      <div className="text-center">
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-medium mt-2">{subtitle}</div>
      </div>
      <div className="mt-4">
        {redirectInitial && <Link href="/">Página inicial</Link>}
      </div>
    </div>
  )
}

export default EmptyState
