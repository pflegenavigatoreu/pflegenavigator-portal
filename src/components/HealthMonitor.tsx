'use client'

import { useState, useEffect } from 'react'
import { Activity, Database, HardDrive, Cpu, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: {
      status: 'ok' | 'error'
      responseTime: number
      message?: string
    }
    filesystem: {
      status: 'ok' | 'error'
      writable: boolean
      message?: string
    }
    memory: {
      status: 'ok' | 'warning' | 'error'
      freeMB: number
      totalMB: number
      usedPercent: number
      message?: string
    }
    cpu: {
      status: 'ok' | 'warning' | 'error'
      loadAverage: number[]
      usagePercent: number
      message?: string
    }
  }
}

interface DBHealthStatus {
  status: 'ok' | 'error'
  timestamp: string
  responseTime: number
  connection: {
    connected: boolean
    latencyMs: number
  }
  query: {
    executed: boolean
    rowsReturned: number
    error?: string
  }
  version?: string
  message?: string
}

interface HealthHistory {
  timestamp: string
  status: 'ok' | 'degraded' | 'error'
  checks: HealthStatus['checks']
}

const statusColors = {
  ok: 'bg-green-500',
  degraded: 'bg-yellow-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500'
}

const statusIcons = {
  ok: CheckCircle,
  degraded: AlertCircle,
  error: XCircle,
  warning: AlertCircle
}

export default function HealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [dbHealth, setDbHealth] = useState<DBHealthStatus | null>(null)
  const [history, setHistory] = useState<HealthHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHealthData()
    const interval = setInterval(fetchHealthData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchHealthData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch main health endpoint
      const healthRes = await fetch('/api/health')
      if (!healthRes.ok) {
        throw new Error(`Health endpoint returned ${healthRes.status}`)
      }
      const healthData: HealthStatus = await healthRes.json()
      setHealth(healthData)

      // Fetch DB health
      const dbRes = await fetch('/api/health/db')
      if (dbRes.ok) {
        const dbData: DBHealthStatus = await dbRes.json()
        setDbHealth(dbData)
      }

      // Update history (keep last 24h - here simplified to last 50 entries)
      setHistory(prev => {
        const newHistory = [...prev, {
          timestamp: healthData.timestamp,
          status: healthData.status,
          checks: healthData.checks
        }]
        return newHistory.slice(-50)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data')
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${mins}m`
  }

  if (loading && !health) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <Activity className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading health data...</span>
        </div>
      </div>
    )
  }

  if (error && !health) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center text-red-600">
          <XCircle className="w-6 h-6 mr-2" />
          <span>Error: {error}</span>
        </div>
        <button
          onClick={fetchHealthData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!health) return null

  const StatusIcon = statusIcons[health.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow">
        <div className="flex items-center">
          <Activity className={`w-8 h-8 mr-3 ${statusColors[health.status].replace('bg-', 'text-')}`} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">System Health</h2>
            <p className="text-sm text-gray-500">
              Version {health.version} • Uptime: {formatUptime(health.uptime)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <StatusIcon className={`w-6 h-6 mr-2 ${statusColors[health.status].replace('bg-', 'text-')}`} />
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[health.status]}`}>
            {health.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Database */}
        <div className={`p-4 rounded-lg border-2 ${
          health.checks.database.status === 'ok' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center mb-2">
            <Database className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">Database</span>
          </div>
          <div className="flex items-center">
            {health.checks.database.status === 'ok' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={health.checks.database.status === 'ok' ? 'text-green-700' : 'text-red-700'}>
              {health.checks.database.status === 'ok' ? 'Healthy' : 'Error'}
            </span>
          </div>
          {health.checks.database.status === 'ok' && (
            <p className="text-xs text-gray-500 mt-1">
              Response: {health.checks.database.responseTime}ms
            </p>
          )}
          {health.checks.database.message && (
            <p className="text-xs text-red-600 mt-1">{health.checks.database.message}</p>
          )}
        </div>

        {/* Filesystem */}
        <div className={`p-4 rounded-lg border-2 ${
          health.checks.filesystem.status === 'ok' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center mb-2">
            <HardDrive className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">Filesystem</span>
          </div>
          <div className="flex items-center">
            {health.checks.filesystem.status === 'ok' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={health.checks.filesystem.status === 'ok' ? 'text-green-700' : 'text-red-700'}>
              {health.checks.filesystem.writable ? 'Writable' : 'Not Writable'}
            </span>
          </div>
          {health.checks.filesystem.message && (
            <p className="text-xs text-red-600 mt-1">{health.checks.filesystem.message}</p>
          )}
        </div>

        {/* Memory */}
        <div className={`p-4 rounded-lg border-2 ${
          health.checks.memory.status === 'ok' ? 'border-green-200 bg-green-50' :
          health.checks.memory.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center mb-2">
            <HardDrive className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">Memory</span>
          </div>
          <div className="flex items-center">
            {health.checks.memory.status === 'ok' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : health.checks.memory.status === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={
              health.checks.memory.status === 'ok' ? 'text-green-700' :
              health.checks.memory.status === 'warning' ? 'text-yellow-700' :
              'text-red-700'
            }>
              {health.checks.memory.usedPercent}% used
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {health.checks.memory.freeMB}MB / {health.checks.memory.totalMB}MB free
          </p>
          {health.checks.memory.message && (
            <p className={`text-xs mt-1 ${health.checks.memory.status === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
              {health.checks.memory.message}
            </p>
          )}
        </div>

        {/* CPU */}
        <div className={`p-4 rounded-lg border-2 ${
          health.checks.cpu.status === 'ok' ? 'border-green-200 bg-green-50' :
          health.checks.cpu.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center mb-2">
            <Cpu className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">CPU</span>
          </div>
          <div className="flex items-center">
            {health.checks.cpu.status === 'ok' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : health.checks.cpu.status === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={
              health.checks.cpu.status === 'ok' ? 'text-green-700' :
              health.checks.cpu.status === 'warning' ? 'text-yellow-700' :
              'text-red-700'
            }>
              {health.checks.cpu.usagePercent}% load
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Load: {health.checks.cpu.loadAverage.map(l => l.toFixed(2)).join(', ')}
          </p>
          {health.checks.cpu.message && (
            <p className={`text-xs mt-1 ${health.checks.cpu.status === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
              {health.checks.cpu.message}
            </p>
          )}
        </div>
      </div>

      {/* DB Health Details */}
      {dbHealth && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Connection</p>
              <p className={`font-medium ${dbHealth.connection.connected ? 'text-green-600' : 'text-red-600'}`}>
                {dbHealth.connection.connected ? 'Connected' : 'Failed'}
              </p>
              <p className="text-xs text-gray-400">{dbHealth.connection.latencyMs}ms</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Query Status</p>
              <p className={`font-medium ${dbHealth.query.executed ? 'text-green-600' : 'text-red-600'}`}>
                {dbHealth.query.executed ? 'Success' : 'Failed'}
              </p>
              <p className="text-xs text-gray-400">{dbHealth.query.rowsReturned} rows</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Response Time</p>
              <p className="font-medium text-gray-800">{dbHealth.responseTime}ms</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Version</p>
              <p className="font-medium text-gray-800">{dbHealth.version || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Health History (Last {history.length} checks)
          </h3>
          <div className="h-24 flex items-end space-x-1">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className={`flex-1 min-w-[4px] rounded-t ${statusColors[entry.status]}`}
                style={{ height: `${(idx + 1) / history.length * 100}%` }}
                title={`${new Date(entry.timestamp).toLocaleTimeString()} - ${entry.status}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{history.length}h ago</span>
            <span>Now</span>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchHealthData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          <Activity className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  )
}
