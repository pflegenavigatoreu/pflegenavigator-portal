import path from 'path'
import { promises as fs } from 'fs'

interface HealthAlert {
  timestamp: string
  service: string
  status: 'fail' | 'recover'
  message: string
  severity: 'critical' | 'warning'
}

interface AlertConfig {
  telegramBotToken?: string
  telegramChatId?: string
  adminEmail?: string
  frankEmail?: string
  failureThreshold: number // Number of consecutive failures before escalating
}

const DEFAULT_CONFIG: AlertConfig = {
  failureThreshold: 3
}

const config: AlertConfig = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  adminEmail: process.env.ADMIN_EMAIL,
  frankEmail: process.env.FRANK_EMAIL,
  failureThreshold: parseInt(process.env.HEALTH_FAILURE_THRESHOLD || '3')
}

// In-memory failure tracking
const failureCounts: Record<string, number> = {}
const lastAlertTime: Record<string, number> = {}

// Rate limiting: min 5 minutes between alerts for same service
const ALERT_COOLDOWN_MS = 5 * 60 * 1000

export async function sendHealthAlert(
  service: string,
  status: 'fail' | 'recover',
  message: string,
  severity: 'critical' | 'warning' = 'warning'
): Promise<void> {
  const timestamp = new Date().toISOString()
  const alert: HealthAlert = {
    timestamp,
    service,
    status,
    message,
    severity
  }

  // Log to file
  await logAlert(alert)

  // Check rate limiting
  const now = Date.now()
  const lastAlert = lastAlertTime[service] || 0
  if (now - lastAlert < ALERT_COOLDOWN_MS) {
    return // Skip alert due to rate limiting
  }

  // Track failures
  if (status === 'fail') {
    failureCounts[service] = (failureCounts[service] || 0) + 1
  } else {
    failureCounts[service] = 0
  }

  const failureCount = failureCounts[service] || 0

  // Send Telegram alert for failures or recovery
  if (config.telegramBotToken && config.telegramChatId) {
    await sendTelegramAlert(alert, failureCount)
  }

  // Send email escalation after threshold failures
  if (status === 'fail' && failureCount >= config.failureThreshold) {
    if (config.frankEmail) {
      await sendEmailAlert(config.frankEmail, alert, failureCount)
    }
    // Reset counter after escalation
    failureCounts[service] = 0
  }

  // Update last alert time
  lastAlertTime[service] = now
}

async function sendTelegramAlert(alert: HealthAlert, failureCount: number): Promise<void> {
  try {
    const emoji = alert.status === 'fail' ? '🔴' : '🟢'
    const severityEmoji = alert.severity === 'critical' ? '⚠️' : '⚡'
    
    let text = `${emoji} *Health Alert* ${severityEmoji}\n\n`
    text += `*Service:* ${alert.service}\n`
    text += `*Status:* ${alert.status === 'fail' ? 'FAILED' : 'RECOVERED'}\n`
    text += `*Time:* ${new Date(alert.timestamp).toLocaleString('de-DE')}\n`
    
    if (alert.status === 'fail') {
      text += `*Failures:* ${failureCount}\n`
    }
    
    text += `\n${alert.message}`

    const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text,
        parse_mode: 'Markdown'
      })
    })

    if (!response.ok) {
      console.error('Failed to send Telegram alert:', await response.text())
    }
  } catch (error) {
    console.error('Error sending Telegram alert:', error)
  }
}

async function sendEmailAlert(recipient: string, alert: HealthAlert, failureCount: number): Promise<void> {
  // This would integrate with your email service
  // For now, we log the intent
  console.log(`[EMAIL ESCALATION] Would send email to ${recipient}`, {
    recipient,
    subject: `🚨 CRITICAL: ${alert.service} failed ${failureCount} times`,
    body: alert.message,
    timestamp: alert.timestamp
  })

  // TODO: Implement actual email sending via your email provider
  // Example with a generic email service:
  // await sendEmail({
  //   to: recipient,
  //   subject: `🚨 CRITICAL: ${alert.service} failed ${failureCount} times`,
  //   html: `
  //     <h2>Health Check Failure</h2>
  //     <p><strong>Service:</strong> ${alert.service}</p>
  //     <p><strong>Status:</strong> FAILED</p>
  //     <p><strong>Consecutive Failures:</strong> ${failureCount}</p>
  //     <p><strong>Message:</strong> ${alert.message}</p>
  //     <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString('de-DE')}</p>
  //   `
  // })
}

async function logAlert(alert: HealthAlert): Promise<void> {
  try {
    const logDir = path.join(process.cwd(), 'logs')
    const logPath = path.join(logDir, 'health-alerts.log')
    
    // Ensure log directory exists
    await fs.mkdir(logDir, { recursive: true }).catch(() => {})
    
    const logEntry = `[${alert.timestamp}] ${alert.status.toUpperCase()} [${alert.severity}] ${alert.service}: ${alert.message}\n`
    
    await fs.appendFile(logPath, logEntry, 'utf-8').catch(() => {})
  } catch {
    // Silent fail for logging
  }
}

export function getFailureCount(service: string): number {
  return failureCounts[service] || 0
}

export function resetFailureCount(service: string): void {
  failureCounts[service] = 0
}

export function resetAllFailureCounts(): void {
  Object.keys(failureCounts).forEach(key => {
    failureCounts[key] = 0
  })
}
