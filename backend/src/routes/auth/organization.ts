import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { cancelAsaasSubscription } from '../../lib/payments/asaas.js'
import { prisma } from '../../lib/prisma.js'
import { errorResponseSchema } from '../../schemas/shared.js'

const deleteOrganizationSchema = z.object({
  confirmation: z.literal('EXCLUIR'),
})

export const organization: FastifyPluginAsyncZod = async (app) => {
  app.delete<{ Body: z.infer<typeof deleteOrganizationSchema> }>(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['auth'],
        description:
          'Remove permanentemente a Rede selecionada (header X-Organization-Id ou sessão atual) e todos os seus dados operacionais. ' +
          'Cancela a recorrência no Asaas via providerSubscriptionId antes de apagar a subscription local. ' +
          'Incrementa User.sessionVersion de todos os membros para revogar sessões antigas. ' +
          'BillingIntent e PaymentWebhookEvent são retidos por auditoria (sem vínculo com Organization, apenas userId).',
        body: deleteOrganizationSchema,
        response: {
          204: z.null(),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          502: errorResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      // Seleção explícita de tenant: header vence a sessão para multi-org não cair no take 1.
      const rawHeader = request.headers['x-organization-id']
      const selectedOrganizationId = (Array.isArray(rawHeader) ? rawHeader[0] : rawHeader)?.trim()
      const organizationId = selectedOrganizationId || request.user.organizationId
      if (!organizationId) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Nenhuma comunidade ativa foi encontrada nesta conta.',
        })
      }

      // Autorização unificada e autoritativa no DB: uma única leitura decide 404 vs 403.
      const membership = await prisma.organizationUser.findUnique({
        where: { organizationId_userId: { organizationId, userId: request.user.sub } },
        select: { role: true, status: true },
      })
      if (!membership) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Nenhuma comunidade ativa foi encontrada nesta conta.',
        })
      }
      if (membership.status !== 'ACTIVE' || membership.role !== 'ADMIN') {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'ORGANIZATION_DELETE_DENIED',
          message: 'Somente a pessoa administradora pode remover a comunidade.',
        })
      }

      // Cancela recorrência no provedor antes de apagar a subscription local.
      const subscription = await prisma.subscription.findUnique({
        where: { organizationId },
        select: { provider: true, providerSubscriptionId: true },
      })
      if (subscription?.providerSubscriptionId) {
        try {
          await cancelAsaasSubscription(subscription.providerSubscriptionId)
        } catch (error) {
          request.log.warn(
            { error, organizationId, providerSubscriptionId: subscription.providerSubscriptionId },
            'Falha ao cancelar assinatura no Asaas antes de remover a comunidade',
          )
        }
      }

      await prisma.$transaction(async (tx) => {
        const members = await tx.organizationUser.findMany({
          where: { organizationId },
          select: { userId: true },
        })
        const memberIds = [...new Set(members.map((member) => member.userId))]

        const churches = await tx.church.findMany({
          where: { organizationId },
          select: { id: true },
        })
        const churchIds = churches.map((church) => church.id)

        if (churchIds.length > 0) {
          await tx.eventParticipant.deleteMany({
            where: { event: { churchId: { in: churchIds } } },
          })
          await tx.attendanceHistory.deleteMany({
            where: { event: { churchId: { in: churchIds } } },
          })
          await tx.memberGroup.deleteMany({
            where: {
              OR: [
                { member: { churchId: { in: churchIds } } },
                { group: { churchId: { in: churchIds } } },
              ],
            },
          })
          await tx.event.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.group.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.financeEntry.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.member.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.churchUser.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.setting.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.userInvite.deleteMany({ where: { churchId: { in: churchIds } } })
          await tx.church.deleteMany({ where: { id: { in: churchIds } } })
        }

        await tx.userInvite.deleteMany({ where: { organizationId } })
        await tx.subscription.deleteMany({ where: { organizationId } })
        await tx.organizationUser.deleteMany({ where: { organizationId } })
        await tx.organization.delete({ where: { id: organizationId } })

        // Revoga sessões: sem membership + sessionVersion bump, JWT antigo não vira zumbi.
        // BillingIntent e PaymentWebhookEvent são propositalmente retidos para auditoria
        // fiscal e idempotência de webhooks (vinculados a userId, não a organizationId).
        if (memberIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: memberIds } },
            data: { sessionVersion: { increment: 1 } },
          })
        }
      })

      return reply.status(204).send()
    },
  )
}
