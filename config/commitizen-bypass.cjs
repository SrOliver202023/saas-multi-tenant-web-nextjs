/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const flagPath = path.resolve(".git/commitizen-flag");

// Cria a flag para indicar que é commit via Commitizen
fs.writeFileSync(flagPath, "commitizen");

try {
  execSync("npx cz", { stdio: "inherit" });
} catch (error) {
  // Se o usuário cancelou (Ctrl+C), sai silenciosamente
  if (error.signal === "SIGINT" || error.status === 130) {
    console.log("\n🔵 Commit cancelado pelo usuário.");
    process.exit(0);
  }

  // Se foi outro tipo de erro, mostra a mensagem
  console.error("🚫 Commit cancelado");
  process.exit(1);
} finally {
  // Sempre remove a flag, mesmo se der erro
  if (fs.existsSync(flagPath)) {
    fs.unlinkSync(flagPath);
  }
}
