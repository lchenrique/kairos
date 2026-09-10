import net from 'node:net'

/**
 * Finds an available TCP port, starting at the requested port.
 * Binding without a host catches both IPv4 and IPv6 listeners on Windows.
 */
export async function findFreePort(preferredPort = 3001, maxAttempts = 100) {
  const firstPort = Number.isInteger(preferredPort) && preferredPort > 0 ? preferredPort : 3001

  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = firstPort + offset
    const available = await new Promise((resolve) => {
      const server = net.createServer()

      server.once('error', () => resolve(false))
      server.listen(port, () => {
        server.close(() => resolve(true))
      })
    })

    if (available) {
      return port
    }
  }

  throw new Error(`Nenhuma porta livre encontrada entre ${firstPort} e ${firstPort + maxAttempts - 1}.`)
}
