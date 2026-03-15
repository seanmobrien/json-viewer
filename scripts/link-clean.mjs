#!/usr/bin/env node
// link-clean.mjs
// Cross-platform launcher for the link-cleaning script.
// Detects whether PowerShell is available and runs the appropriate
// platform-specific script (clean-link.ps1 on Windows/pwsh, clean-link.sh
// otherwise).  Any arguments passed to this script are forwarded verbatim.

import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Arguments to pass through to the underlying script (skip node + script path)
const args = process.argv.slice(2)

/**
 * Returns the PowerShell executable name if PowerShell is available, or null.
 * Prefers `pwsh` (PowerShell Core) over `powershell` (Windows PowerShell).
 * Uses a benign no-op command to probe for availability.
 * @returns {string|null}
 */
function detectPowerShell() {
  for (const exe of ['pwsh', 'powershell']) {
    const result = spawnSync(exe, ['-NoProfile', '-Command', '$null'], {
      stdio: 'ignore',
      timeout: 5000
    })
    if (result.status === 0) {
      return exe
    }
  }
  return null
}

const isWindows = process.platform === 'win32'
const ps = isWindows ? detectPowerShell() : null

if (ps) {
  // --- PowerShell path ---
  // Use spawnSync with an args array to avoid command injection.
  // Map --flag arguments to PowerShell switch syntax (-Flag).
  const scriptPath = join(__dirname, 'clean-link.ps1')
  const psArgs = args.map((a) => (a.startsWith('--') ? `-${a.slice(2)}` : a))
  const result = spawnSync(ps, ['-ExecutionPolicy', 'Bypass', '-File', scriptPath, ...psArgs], {
    stdio: 'inherit',
    cwd: dirname(__dirname)
  })
  process.exitCode = result.status ?? 1
} else {
  // --- Bash path ---
  // Use spawnSync with an args array to avoid command injection.
  const scriptPath = join(__dirname, 'clean-link.sh')
  const result = spawnSync('bash', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: dirname(__dirname)
  })
  process.exitCode = result.status ?? 1
}
