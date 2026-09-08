import { createHash } from "node:crypto"
import AxeBuilder from "@axe-core/playwright"
import { expect, type Page, test } from "@playwright/test"

const apiUrl = "http://localhost:3341"
const adminEmail = "admin.e2e@example.com"
const adminPassword = "KairosE2E123!"

async function signOut(page: Page) {
  await page.getByRole("button", { name: /Administrador E2E|Usuário E2E/ }).click()
  await page.getByRole("menuitem", { name: "Sair" }).click()
  await expect(page).toHaveURL(/\/login$/)
}

async function auditCurrentPage(page: Page, route: string) {
  await page.goto(route)
  await expect(page.locator("main")).toBeVisible()
  await page.waitForTimeout(800)

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  )
  const viewport = page.viewportSize()
  const location = `${route} @ ${viewport?.width ?? "?"}x${viewport?.height ?? "?"}`
  const findings = blockingViolations.map((violation) => {
    const nodes = violation.nodes.map((node) => {
      const reason = [...node.any, ...node.all, ...node.none]
        .map((check) => check.message)
        .filter(Boolean)
        .join("; ")
      return `${node.html.slice(0, 220)} :: ${reason}`
    }).join(" | ")
    return `${location}: ${violation.id} - ${violation.help} (${violation.nodes.length} ocorrência(s)): ${nodes}`
  })

  const hasPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )
  if (hasPageOverflow) {
    const overflowDetails = await page.evaluate(() => {
      const viewportWidth = window.innerWidth
      return Array.from(document.body.querySelectorAll<HTMLElement>("*"))
        .map((element) => ({
          element,
          rect: element.getBoundingClientRect(),
        }))
        .filter(({ element, rect }) => {
          const style = window.getComputedStyle(element)
          return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 &&
            (rect.right > viewportWidth + 1 || rect.left < -1)
        })
        .slice(0, 5)
        .map(({ element, rect }) =>
          `${element.tagName.toLowerCase()}.${element.className.toString().replaceAll(" ", ".")} [${Math.round(rect.left)}, ${Math.round(rect.right)}]`,
        )
    })
    findings.push(`${location}: scroll horizontal na página: ${overflowDetails.join(" | ")}`)
  }

  return findings
}

test("fluxo lançável: setup, login, CRUD principal, permissão e logout", async ({
  page,
}, testInfo) => {
  const accessibilityFindings: string[] = []
  await page.goto("/setup")
  await page.getByLabel("Nome da Rede").fill("Rede E2E")
  await page.getByLabel("Igreja sede").fill("Igreja Central E2E")
  await page.getByLabel("Seu nome").fill("Administrador E2E")
  await page.getByLabel("E-mail de acesso").fill(adminEmail)
  await page.getByLabel("Senha", { exact: true }).fill(adminPassword)
  await page.getByLabel("Confirmar senha").fill(adminPassword)
  await page.getByRole("button", { name: "Criar Rede e entrar" }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole("heading", { name: "Olá, Administrador" })).toBeVisible()

  await signOut(page)
  await page.getByLabel("E-mail").fill(adminEmail)
  await page.getByRole("textbox", { name: "Senha", exact: true }).fill(adminPassword)
  await page.getByRole("button", { name: "Entrar", exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.goto("/members")
  await page.getByRole("button", { name: "Novo Membro" }).click()
  await expect(page.getByRole("heading", { name: "Novo Membro" })).toBeVisible()
  await page.getByLabel("Nome").fill("Ana E2E")
  await page.getByRole("button", { name: "Criar membro" }).click()
  await expect(page.getByText("Ana E2E", { exact: true })).toBeVisible()

  await page.goto("/groups")
  await page.getByRole("button", { name: "Novo grupo" }).click()
  await page.getByLabel("Nome").fill("Grupo E2E")
  await page.getByLabel("Descrição").fill("Grupo criado pelo teste de lançamento")
  await page.getByRole("button", { name: "Criar", exact: true }).click()
  await expect(page.getByText("Grupo E2E", { exact: true })).toBeVisible()

  await page.goto("/events")
  await page.getByRole("button", { name: "Novo evento" }).click()
  await page.getByLabel("Título").fill("Encontro E2E")
  await page.getByLabel("Início").fill("2026-09-20T18:00")
  await page.getByRole("button", { name: "Criar evento" }).click()
  await expect(page.getByText("Encontro E2E", { exact: true })).toBeVisible()

  await page.goto("/dashboard")
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  await page.keyboard.press("Tab")
  await expect(page.getByRole("link", { name: "Ir para o conteúdo principal" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main-content")).toBeFocused()

  const allProtectedRoutes = [
    "/dashboard",
    "/members",
    "/groups",
    "/events",
    "/calendar",
    "/reports",
    "/finance",
    "/settings",
    "/portal",
  ]
  const protectedRoutes = process.env.E2E_AUDIT_ROUTE
    ? [process.env.E2E_AUDIT_ROUTE]
    : allProtectedRoutes
  for (const route of protectedRoutes) {
    accessibilityFindings.push(...await auditCurrentPage(page, route))
  }
  await page.goto("/dashboard")
  await page.waitForTimeout(800)
  await page.screenshot({
    path: testInfo.outputPath("dashboard-desktop.png"),
    fullPage: true,
  })

  const themeWasDark = await page.locator("html").evaluate((element) =>
    element.classList.contains("dark"),
  )
  await page.getByRole("button", { name: "Alternar tema" }).click()
  await expect
    .poll(() => page.locator("html").evaluate((element) => element.classList.contains("dark")))
    .toBe(!themeWasDark)
  accessibilityFindings.push(...await auditCurrentPage(page, "/dashboard"))

  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of protectedRoutes) {
    accessibilityFindings.push(...await auditCurrentPage(page, route))
  }
  await page.goto("/calendar")
  await page.waitForTimeout(800)
  await page.screenshot({
    path: testInfo.outputPath("calendar-mobile.png"),
    fullPage: true,
  })
  await page.setViewportSize({ width: 1280, height: 720 })
  expect(accessibilityFindings, accessibilityFindings.join("\n")).toEqual([])
  accessibilityFindings.length = 0

  const inviteEmail = "user.e2e@example.com"
  const profileBeforeInvite = await page.request.get(`${apiUrl}/auth/profile`, {
    headers: { "X-Kairos-Client": "web" },
  })
  expect(
    profileBeforeInvite.status(),
    `Sessão administrativa perdida durante a auditoria: ${await profileBeforeInvite.text()}`,
  ).toBe(200)
  const invite = await page.request.post(`${apiUrl}/auth/invites`, {
    headers: { "X-Kairos-Client": "web" },
    data: { name: "Usuário E2E", email: inviteEmail, role: "USER" },
  })
  expect(invite.status()).toBe(201)

  const rawInviteToken = createHash("sha256")
    .update(`kairos-invite:${inviteEmail}`)
    .digest("hex")
  const accepted = await page.request.post(`${apiUrl}/auth/invites/accept`, {
    headers: { "X-Kairos-Client": "web" },
    data: { token: rawInviteToken, password: "UserE2E123!" },
  })
  expect(accepted.status()).toBe(201)

  await signOut(page)
  await page.getByLabel("E-mail").fill(inviteEmail)
  await page.getByRole("textbox", { name: "Senha", exact: true }).fill("UserE2E123!")
  await page.getByRole("button", { name: "Entrar", exact: true }).click()
  await expect(page).toHaveURL(/\/portal$/)
  await expect(page.getByRole("link", { name: "Configurações" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Membros" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Grupos" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Relatórios" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Financeiro" })).toHaveCount(0)

  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/portal$/)
  await page.goto("/events")
  await expect(page.getByRole("button", { name: "Novo evento" })).toHaveCount(0)

  const forbiddenTeamList = await page.request.get(`${apiUrl}/auth/users`, {
    headers: { "X-Kairos-Client": "web" },
  })
  expect(forbiddenTeamList.status()).toBe(403)
  const forbiddenMembers = await page.request.get(`${apiUrl}/members`, {
    headers: { "X-Kairos-Client": "web" },
  })
  expect(forbiddenMembers.status()).toBe(403)

  await signOut(page)
  accessibilityFindings.push(...await auditCurrentPage(page, "/login"))
  expect(accessibilityFindings, accessibilityFindings.join("\n")).toEqual([])
})
