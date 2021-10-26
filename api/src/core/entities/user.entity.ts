enum user_role {
  basic,
  manager,
  admin,
}

export interface User {
  id: number;
  username: string;
  password: string;
  user_role: user_role;
}
