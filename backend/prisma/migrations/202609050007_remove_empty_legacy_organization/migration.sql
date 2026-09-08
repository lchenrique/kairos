-- A migration multi-tenant preservava uma Rede legada mesmo quando a instalação
-- anterior estava completamente vazia. Remova somente esse registro sentinela
-- quando ele não possui igreja nem usuário associado, liberando o setup inicial.
DELETE FROM "Organization"
WHERE "id" = 'legacy-organization'
  AND NOT EXISTS (
    SELECT 1 FROM "Church"
    WHERE "Church"."organizationId" = 'legacy-organization'
  )
  AND NOT EXISTS (
    SELECT 1 FROM "OrganizationUser"
    WHERE "OrganizationUser"."organizationId" = 'legacy-organization'
  );
