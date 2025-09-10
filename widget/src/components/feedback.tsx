import { SuccessIcon, FailedIcon, RefreshCw04Icon, WarningIcon } from './icons'





type FeedbackDialogProps = {
  status: 'loading' | 'error' | 'success' | 'warning'
  description?: string
  title: string
}

export function FeedbackDialog({ description, status, title }: FeedbackDialogProps) {
  return (
    <div className="flex flex-col gap-6 h-full w-full justify-center items-center py-28">
      <div className="size-14">
        {status === 'success' && <SuccessIcon />}
        {status === 'error' && <FailedIcon />}
        {status === 'loading' && <RefreshCw04Icon className="animate-spin" />}
        {status === 'warning' && <WarningIcon />}
      </div>
      <div className="flex flex-col gap-3 items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
      </div>
    </div>
  )
}
