import { SuccessIcon, FailedIcon, RefreshCw04Icon, WarningIcon } from './icons'
import { cn } from '../utils'





type FeedbackDialogProps = {
  status: 'loading' | 'error' | 'success' | 'warning'
  description?: string
  title: string
}

export function FeedbackDialog({ description, status, title }: FeedbackDialogProps) {
  return (
    <div className="flex flex-col gap-6 h-full w-full justify-center items-center py-28">
      <div className={cn(
        "size-20 flex items-center justify-center",
        status === 'error' ? 'size-20' : 'size-20'
      )}>
        {status === 'success' && <SuccessIcon className="w-full h-full" style={{ width: '100%', height: '100%' }} />}
        {status === 'error' && <FailedIcon className="w-full h-full" style={{ width: '100%', height: '100%' }} />}
        {status === 'loading' && <RefreshCw04Icon className="animate-spin w-full h-full text-foreground" style={{ width: '100%', height: '100%' }} />}
        {status === 'warning' && <WarningIcon className="w-full h-full" style={{ width: '100%', height: '100%' }} />}
      </div>
      <div className="flex flex-col gap-3 items-center">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
      </div>
    </div>
  )
}
