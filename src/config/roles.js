const roles = ['admin', 'user'];

const roleRights = new Map();
roleRights.set(roles[0], ['manageAdmin']);
roleRights.set(roles[1], ['manageUsers']);

module.exports = {
  roles,
  roleRights,
};