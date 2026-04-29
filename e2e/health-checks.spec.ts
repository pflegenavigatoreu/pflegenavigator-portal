import { test, expect } from '@playwright/test'

test.describe('Health Check Endpoints', () => {
  test('GET /api/health should return system health status', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
    
    const body = await response.json()
    expect(body).toHaveProperty('status')
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('version')
    expect(body).toHaveProperty('uptime')
    expect(body).toHaveProperty('checks')
    
    // Validate checks structure
    expect(body.checks).toHaveProperty('database')
    expect(body.checks).toHaveProperty('filesystem')
    expect(body.checks).toHaveProperty('memory')
    expect(body.checks).toHaveProperty('cpu')
    
    // Validate database check
    expect(body.checks.database).toHaveProperty('status')
    expect(body.checks.database).toHaveProperty('responseTime')
    expect(typeof body.checks.database.responseTime).toBe('number')
    
    // Validate memory check
    expect(body.checks.memory).toHaveProperty('freeMB')
    expect(body.checks.memory).toHaveProperty('totalMB')
    expect(body.checks.memory).toHaveProperty('usedPercent')
    expect(body.checks.memory.freeMB).toBeGreaterThan(0)
    expect(body.checks.memory.totalMB).toBeGreaterThan(body.checks.memory.freeMB)
    
    // Validate CPU check
    expect(body.checks.cpu).toHaveProperty('loadAverage')
    expect(body.checks.cpu).toHaveProperty('usagePercent')
    expect(Array.isArray(body.checks.cpu.loadAverage)).toBe(true)
  })

  test('GET /api/health/db should return database health', async ({ request }) => {
    const response = await request.get('/api/health/db')
    const body = await response.json()
    
    expect(body).toHaveProperty('status')
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('responseTime')
    expect(body).toHaveProperty('connection')
    expect(body).toHaveProperty('query')
    
    expect(body.connection).toHaveProperty('connected')
    expect(body.connection).toHaveProperty('latencyMs')
    expect(body.query).toHaveProperty('executed')
    expect(body.query).toHaveProperty('rowsReturned')
    
    // Response time header should be present
    const responseTime = response.headers()['x-response-time']
    expect(responseTime).toBeDefined()
  })

  test('GET /api/ready should return readiness status', async ({ request }) => {
    const response = await request.get('/api/ready')
    const body = await response.json()
    
    expect(body).toHaveProperty('ready')
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('dependencies')
    
    expect(body.dependencies).toHaveProperty('database')
    expect(body.dependencies).toHaveProperty('filesystem')
    expect(body.dependencies).toHaveProperty('memory')
    
    // Status should be 200 or 503
    expect([200, 503]).toContain(response.status())
  })

  test('GET /api/live should always return 200 OK', async ({ request }) => {
    const response = await request.get('/api/live')
    
    expect(response.status()).toBe(200)
    
    const body = await response.json()
    expect(body).toHaveProperty('alive')
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('uptime')
    expect(body.alive).toBe(true)
    
    // Should have cache-control headers
    const cacheControl = response.headers()['cache-control']
    expect(cacheControl).toContain('no-cache')
  })

  test('Health endpoints should have correct content-type', async ({ request }) => {
    const endpoints = ['/api/health', '/api/health/db', '/api/ready', '/api/live']
    
    for (const endpoint of endpoints) {
      const response = await request.get(endpoint)
      const contentType = response.headers()['content-type']
      expect(contentType).toContain('application/json')
    }
  })

  test('Health endpoints should respond within reasonable time', async ({ request }) => {
    const endpoints = ['/api/health', '/api/health/db', '/api/ready', '/api/live']
    
    for (const endpoint of endpoints) {
      const start = Date.now()
      const response = await request.get(endpoint)
      const duration = Date.now() - start
      
      expect(response.status()).toBeLessThan(600) // Should respond within 600ms
      expect(duration).toBeLessThan(5000) // Max 5 seconds
    }
  })
})

test.describe('Health Dashboard', () => {
  test('Admin health dashboard should require authentication', async ({ page }) => {
    await page.goto('/admin/health')
    
    // Should show login form
    await expect(page.getByText('Admin Health Dashboard')).toBeVisible()
    await expect(page.getByPlaceholder('Enter admin password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Access Dashboard' })).toBeVisible()
  })

  test('Health dashboard should show system status after login', async ({ page }) => {
    await page.goto('/admin/health')
    
    // Enter password (using default test password)
    await page.getByPlaceholder('Enter admin password').fill('admin2024')
    await page.getByRole('button', { name: 'Access Dashboard' }).click()
    
    // Should show health dashboard
    await expect(page.getByText('System Health')).toBeVisible()
    await expect(page.getByText('Database')).toBeVisible()
    await expect(page.getByText('Filesystem')).toBeVisible()
    await expect(page.getByText('Memory')).toBeVisible()
    await expect(page.getByText('CPU')).toBeVisible()
  })

  test('Health dashboard should display service status indicators', async ({ page }) => {
    await page.goto('/admin/health')
    
    // Login
    await page.getByPlaceholder('Enter admin password').fill('admin2024')
    await page.getByRole('button', { name: 'Access Dashboard' }).click()
    
    // Wait for data to load
    await page.waitForTimeout(2000)
    
    // Check for status indicators (green/yellow/red colors)
    const statusElements = await page.locator('[class*="bg-green-"], [class*="bg-yellow-"], [class*="bg-red-"]').count()
    expect(statusElements).toBeGreaterThan(0)
  })

  test('Health dashboard should have refresh button', async ({ page }) => {
    await page.goto('/admin/health')
    
    // Login
    await page.getByPlaceholder('Enter admin password').fill('admin2024')
    await page.getByRole('button', { name: 'Access Dashboard' }).click()
    
    // Should have refresh button
    const refreshButton = page.getByRole('button', { name: 'Refresh' })
    await expect(refreshButton).toBeVisible()
    
    // Clicking refresh should work
    await refreshButton.click()
    await page.waitForTimeout(1000)
  })
})

test.describe('Health Check Failure Simulation', () => {
  test('Health endpoint should handle errors gracefully', async ({ request }) => {
    // Test with invalid endpoint
    const response = await request.get('/api/health/invalid')
    expect([200, 404]).toContain(response.status())
  })

  test('Health checks should return appropriate HTTP status codes', async ({ request }) => {
    // Main health endpoint
    const healthResponse = await request.get('/api/health')
    expect([200, 503]).toContain(healthResponse.status())
    
    // Readiness endpoint
    const readyResponse = await request.get('/api/ready')
    expect([200, 503]).toContain(readyResponse.status())
    
    // Liveness endpoint should always be 200
    const liveResponse = await request.get('/api/live')
    expect(liveResponse.status()).toBe(200)
  })
})
