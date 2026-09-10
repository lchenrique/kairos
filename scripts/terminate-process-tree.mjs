import { spawn } from 'node:child_process'

export function terminateProcessTree(child, signal = 'SIGTERM') {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) {
    return
  }

  if (process.platform === 'win32') {
    const killer = spawn('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    })
    killer.unref()
    return
  }

  child.kill(signal)
}
