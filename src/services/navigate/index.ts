import { useNavigate } from 'react-router-dom'

function qs(params?: ConstructorParameters<typeof URLSearchParams>[0]) {
  return '?' + new URLSearchParams(params || {}).toString()
}
function parseParams(
  search?: Record<string, string | number | undefined>,
): string {
  if (search && typeof search === 'object') {
    return qs(
      Object.keys(search).reduce((acc: Record<string, string>, key) => {
        if (search[key] !== undefined) {
          acc[key] = `${search[key]}`
        }
        return acc
      }, {}),
    )
  }
  return ''
}

export const useNavigateService = () => {
  const navigateService = useNavigate()

  return {
    navigate: (
      url: string,
      params?: Record<string, string | number | undefined>,
    ) => {
      if (navigateService) {
        navigateService(`${url}${parseParams(params)}`)
      } else {
        window.open(`${url}${parseParams(params)}`, '_self')
      }
    },
    replace: (
      url: string,
      params?: Record<string, string | number | undefined>,
    ) => {
      if (navigateService) {
        navigateService(`${url}${parseParams(params)}`, {
          replace: true,
        })
      } else {
        window.open(`${url}${parseParams(params)}`, '_self')
      }
    },
    goBack: () => {
      if (navigateService) {
        navigateService(-1)
      } else {
        window.history.back()
      }
    },
    reload: () => {
      if (navigateService) {
        navigateService(0)
      } else {
        window.location.reload()
      }
    },
    openExternalLink: (
      url: string,
      isNewTab?: boolean,
      params?: Record<string, string | number | undefined>,
    ) => {
      if (isNewTab) {
        window.open(`${url}${parseParams(params)}`, '_blank')
      } else {
        window.open(`${url}${parseParams(params)}`, '_self')
      }
    },
  }
}