## **RFs (Requisitos Funcionais)**

- [x] **(RF-001)** Deve ser possível realizar um **cadastro inicial de usuário**.
      **Campos obrigatórios:**

  - Email
  - Usuário (username único)
  - Senha
  - Confirmar senha
    **Validações:**
  - O e-mail deve ser único e válido.
  - A senha deve atender aos critérios mínimos de segurança (ver RN-001).

---

- [ ] **(RF-002)** Deve ser possível realizar **autenticação** e obter um **token de acesso (JWT)**.
      **Credenciais aceitas:**

  - Email **ou** Usuário
  - Senha
    **Retorno esperado:**
  - Token de acesso
  - Token de atualização (refresh token)
  - Informações básicas do usuário autenticado

---

- [ ] **(RF-003)** Deve ser possível **criar, atualizar, listar e excluir um workspace**.
      **Campos obrigatórios:**

  - Nome do workspace
  - Descrição (opcional)
    **Regras:**
  - Somente o **usuário criador (owner)** pode excluir ou transferir a propriedade do workspace.
  - O workspace deve estar vinculado a um ou mais usuários (ver RF-004).

---

- [ ] **(RF-004)** Deve ser possível **convidar usuários para participar de um workspace**.
      **Detalhes:**

  - Convite enviado por e-mail.
  - O convite deve conter um **token único** com tempo de expiração (ver RN-003).
  - O convite pode conter o **nível de permissão** (ex: membro, administrador).

---

- [ ] **(RF-005)** Deve ser possível **realizar cadastro inicial através de um convite de workspace**.
      **Fluxo:**

  - O usuário acessa o link de convite.
  - Realiza o cadastro (RF-001).
  - Ao finalizar o cadastro, é automaticamente adicionado ao workspace que originou o convite.

---

- [ ] **(RF-006)** Deve ser possível **aceitar ou recusar um convite** de workspace para **contas já existentes**.
      **Regras:**

  - Convites pendentes devem aparecer no painel do usuário.
  - Ao aceitar, o usuário é adicionado ao workspace.
  - Ao recusar, o convite é invalidado.

---

- [ ] **(RF-007)** Deve ser possível **solicitar recuperação de senha** informando o e-mail cadastrado.
      **Fluxo:**

  - O sistema deve gerar e enviar um **pin/token temporário** para o e-mail informado.
  - O token deve ter **tempo de expiração configurável**.

---

- [ ] **(RF-008)** Deve ser possível **validar o pin/token** de recuperação de senha.
      **Critérios de validação:**

  - Token não expirado.
  - Token não utilizado.
  - Token vinculado ao e-mail correspondente.

---

- [ ] **(RF-009)** Deve ser possível **definir uma nova senha** utilizando o token de recuperação.
      **Campos obrigatórios:**

  - Token válido
  - Nova senha
  - Confirmação da nova senha

---

## **RNs (Regras de Negócio)**

- **(RN-001)** A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.
- **(RN-002)** Cada usuário pode participar de **vários workspaces**, e cada workspace pode ter **vários usuários** (relação N:N).
- **(RN-003)** O **token de convite** deve expirar após 72 horas ou após ser utilizado.
- **(RN-004)** O **token de recuperação de senha** deve expirar em 30 minutos.
- **(RN-005)** Somente o **proprietário do workspace** pode remover membros ou transferir a propriedade.
- **(RN-006)** Usuários convidados devem possuir permissões limitadas até aceitarem o convite.
- **(RN-007)** O e-mail e o nome de usuário devem ser únicos no sistema.

---

## **RNFs (Requisitos Não Funcionais)**

- **(RNF-001)** O sistema deve utilizar **JWT** para autenticação e renovação de sessão.
- **(RNF-002)** Todas as comunicações devem ser realizadas via **HTTPS**.
- **(RNF-003)** O banco de dados deve garantir **integridade referencial** entre usuários e workspaces.
- **(RNF-004)** As operações sensíveis (login, recuperação de senha, convites) devem ser **auditadas**.
- **(RNF-005)** O sistema deve suportar **localização (i18n)** para mensagens e e-mails (ex: português e inglês).
- **(RNF-006)** O tempo máximo de resposta da API deve ser inferior a **1 segundo** para 95% das requisições.
- **(RNF-007)** O sistema deve ser **escalável horizontalmente**, permitindo múltiplas instâncias.
- **(RNF-008)** Deve haver **limite de tentativas de login** para evitar ataques de força bruta.
- **(RNF-009)** Todos os e-mails devem ser enviados de forma **assíncrona** e **registrados em fila** (ex: BullMQ).
