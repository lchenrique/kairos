import { SettingsForm } from "@/components/settings/settings-form"
import { PageHeader } from "@/components/shared/page-header"
import { UserRoleManager } from "@/components/settings/user-role-manager"
import { ChurchUnitManager } from '@/components/settings/church-unit-manager'
import { OrganizationDangerZone } from '@/components/settings/organization-danger-zone'

export default function SettingsPage() {
  return <div className="space-y-5"><PageHeader routeName="Sistema" title="Configurações" subtitle="Gerencie a Rede, as unidades e as preferências de cada igreja." breadcrumb={[{ label: "Sistema" }, { label: "Configurações" }]} variant="compact" /><ChurchUnitManager /><SettingsForm /><UserRoleManager /><OrganizationDangerZone /></div>
}
