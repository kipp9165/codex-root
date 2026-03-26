const users = [];

export function findUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}
