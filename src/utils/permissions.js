export function checkPermissions(interaction) {
  const allowedChannels = process.env.ALLOWED_CHANNELS?.split(',') || [];
  const allowedRoles = process.env.ALLOWED_ROLES?.split(',') || [];

  // Si aucune restriction n'est configurée, autoriser l'accès
  if (allowedChannels.length === 0 && allowedRoles.length === 0) {
    return true;
  }

  // Vérifier le canal
  if (allowedChannels.length > 0 && !allowedChannels.includes(interaction.channelId)) {
    return false;
  }

  // Vérifier les rôles
  if (allowedRoles.length > 0) {
    const userRoles = interaction.member.roles.cache.map(role => role.id);
    if (!allowedRoles.some(roleId => userRoles.includes(roleId))) {
      return false;
    }
  }

  return true;
}