import { STORAGE_KEYS } from '@constants/storage'
import { AuthenticationResponse } from '@interfaces/authentication'

class AuthenticationSessionStorage {
  synchronously = true
  private listeners: ((data?: AuthenticationResponse) => void)[] = []
  private storage?: AuthenticationResponse
  private processInstance?: Promise<unknown>
  private processResolve?: (value: unknown) => void
  constructor() {
    this.storage = undefined
  }

  initialProcessing() {
    return this.processInstance
  }

  async init() {
    if (this.processInstance) {
      return this.processInstance
    }
    this.processInstance = new Promise((resolve) => {
      this.processResolve = resolve
    })
    let storage
    try {
      storage = JSON.parse(
        `${localStorage.getItem(STORAGE_KEYS.AUTHENTICATION)}`,
      )
    } finally {
      this.setAuthentication(storage)
      return this.processInstance
    }
  }

  private endProcessed() {
    if (this.processResolve) {
      this.processResolve(true)
      this.processResolve = undefined
      this.processInstance = undefined
    }
  }

  addListener(listener: (data?: AuthenticationResponse) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.storage))
  }

  getAuthentication() {
    return this.storage
  }

  getAuthenticatedStatus() {
    const authenticationInfo = this.getAuthentication()

    if (!authenticationInfo || !Object.keys(authenticationInfo).length)
      return false

    return true
  }

  setAuthentication(data?: AuthenticationResponse) {
    this.storage = data
    this.endProcessed()
    this.notifyListeners()
  }

  clearAuthentication() {
    this.storage = undefined
    this.notifyListeners()
  }
}

export default new AuthenticationSessionStorage()