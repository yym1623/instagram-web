let socketInstance: { emit: (ev: string, data: unknown) => void; on: (ev: string, fn: (data: unknown) => void) => void } | null = null

export function useSocket() {
  const config = useRuntimeConfig()

  if (import.meta.server) {
    return { socket: null }
  }

  if (!socketInstance) {
    import('socket.io-client').then((module) => {
      const io = module.io
      socketInstance = io(config.public.socketUrl as string, { transports: ['websocket'] }) as unknown as typeof socketInstance
    })
  }

  return {
    get socket() {
      return socketInstance
    },
    whenReady(): Promise<NonNullable<typeof socketInstance>> {
      return new Promise((resolve) => {
        if (socketInstance) {
          resolve(socketInstance)
          return
        }
        const check = setInterval(() => {
          if (socketInstance) {
            clearInterval(check)
            resolve(socketInstance)
          }
        }, 50)
      })
    },
  }
}
