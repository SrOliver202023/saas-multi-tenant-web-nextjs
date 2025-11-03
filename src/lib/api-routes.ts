export const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth", // next-auth endpoints precisam continuar acessíveis
];

export const authRoutes = ["/login", "/register"]; // úteis pra redirecionar usuários já logados

// Opcional: rotas que devem sempre ser acessíveis, mesmo autenticadas
export const alwaysPublic = ["/api/health"];
