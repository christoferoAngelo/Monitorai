# Monitorai 📚
O Monitorai é um sistema de gestão de monitorias desenvolvido para otimizar o acompanhamento de monitorias acadêmicas. Ele permite que administradores gerenciem o ciclo de vida das monitorias, vinculem alunos a disciplinas como monitores e finalizem semestres letivos de forma automatizada.

# Funcionalidades
Gestão de Monitorias: Criação, edição e inativação de monitorias.

Controle de Acesso: Diferenciação de papéis entre Alunos, Monitores e Administradores.

Fluxo de Monitoria: Lógica automática para transformar Alunos em Monitores ao ativar uma monitoria e reverter ao inativar.

Filtros Inteligentes: Busca por disciplinas e filtragem por status (Ativas/Inativas).

Finalização de Semestre: Funcionalidade em lote para encerrar o ciclo acadêmico, desvinculando monitores e inativando turmas.

Relatórios: Interface dedicada para acompanhamento de métricas de monitoria.

# Tecnologias Utilizadas
Este projeto foi construído utilizando:

Frontend: React.js, React Router, Axios.

Backend: Node.js (com Express).

Estilização: CSS puro/Customizado.

Autenticação: JWT (JSON Web Token).

# Como rodar o projeto
Para rodar este projeto em sua máquina local, siga os passos abaixo:

Pré-requisitos
Node.js instalado na máquina.

NPM ou Yarn.

1. Clonar o repositório
Bash
git clone https://github.com/christoferoAngelo/Monitorai.git
cd Monitorai
2. Configuração do Backend
Entre na pasta do backend (ex: /server ou /api):

Bash
cd server
npm install
# Configure seu arquivo .env com as credenciais do banco de dados
npm start
3. Configuração do Frontend
Em um novo terminal, entre na pasta do frontend (ex: /client ou /web):

Bash
cd client
npm install
npm start
O sistema estará disponível em http://localhost:3000 (ou a porta configurada no seu React).

# Regras de Negócio Importantes
Segurança de Login: O sistema verifica o status ativo na tabela de usuários. Usuários com status 0 são impedidos de logar (travado via API).

Ativação/Inativação: Monitorias não podem ser reativadas caso não tenham um monitor vinculado.

Troca de Papéis: Ao inativar uma monitoria, o monitor vinculado é automaticamente revertido para o papel de "ALUNO" no banco de dados.

# Contribuições
Este projeto é desenvolvido para fins acadêmicos. Sinta-se à vontade para abrir Issues ou enviar Pull Requests para melhorias e correções de bugs.

Desenvolvido por Angelo Correia Christofero e Andrea Lima de Moraes
Fatec Guarulhos
