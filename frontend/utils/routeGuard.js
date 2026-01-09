/**
 * Checks if the current user has permission to access a route based on their role.
 * 
 * @param {string|null} currentRole - The role of the current user
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @returns {boolean} - True if access is allowed, false otherwise
 */
export const isRoleAllowed = (currentRole, allowedRoles) => {
  if (!currentRole) {
    return false;
  }

  // If allowRoles includes '*', allow all authenticated users
  if (allowedRoles.includes('*')) {
      return true;
  }

  return allowedRoles.includes(currentRole);
};
