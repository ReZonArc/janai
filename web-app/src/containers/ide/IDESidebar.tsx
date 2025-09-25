import { cn } from '@/lib/utils'
import { 
  IconFiles, 
  IconMessage, 
} from '@tabler/icons-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface IDESidebarProps {
  activeTab: 'files' | 'chat'
  onTabChange: (tab: 'files' | 'chat') => void
}

export function IDESidebar({ activeTab, onTabChange }: IDESidebarProps) {
  const tabs = [
    { id: 'files' as const, icon: IconFiles, label: 'Files' },
    { id: 'chat' as const, icon: IconMessage, label: 'Chat' },
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center py-2 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded hover:bg-accent/50 transition-colors',
                    activeTab === tab.id && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Icon size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{tab.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}