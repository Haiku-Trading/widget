import SuccessIcon from './../icons/success.svg'
import ErrorIcon from './../icons/failed.svg'
import LoadIcon from './../icons/refresh-cw-04.svg'
import WarningIcon from './../icons/warning.svg'

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
        {status === 'error' && <ErrorIcon />}
        {status === 'loading' && <LoadIcon className="animate-spin" />}
        {status === 'warning' && <WarningIcon />}
      </div>
      <div className="flex flex-col gap-3 items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
      </div>
    </div>
  )
}
