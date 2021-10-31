<div align="center">
<img src=".github/assets/logo.png" width="200" />

Aplicação para registro de ponto e monitoramento de jornadas de trabalho

<img src="https://img.shields.io/badge/Node.js-4667d6?style=for-the-badge&logo=nodedotjs&logoColor=white" width="80" />
<img src="https://img.shields.io/badge/TypeScript-6b42d0?style=for-the-badge&logo=typescript&logoColor=white" width="100" />
<img src="https://img.shields.io/badge/PostgreSQL-a934d3?style=for-the-badge&logo=postgresql&logoColor=white" width="102" />
<img src="https://validator.swagger.io/validator/?url=https%3A%2F%2Fraw.githubusercontent.com%2FWeWillWin-W3%2Fponto%2Fmain%2Fdocs%2Fopenapi.yml" height="22" width="80" />
</div>

## :eyes: Visão geral
O **W3 Ponto** é uma aplicação de ponto eletrônico para empresas e funcionários que precisam ter o controle sobre o banco de horas e jornadas de trabalho.

Com o **W3 Ponto** é muito fácil e prático realizar o registro de pontos, funcionários, turnos de trabalho e muito mais.

## :books: Documentação

### Diagrama de entidade e relacionamento
![Diagrama de entidade e relacionamento](./docs/schema.png)

### Diagrama de implantação
![Diagrama de implantação](./docs/deployment-diagram.png)

## Conceitos de sistemas distribuídos
Neste tópico será apresentado conceitos vistos em sala de aula que foram aplicados para a execução do trabalho.

### Arquitetura
A aplicação **W3 Ponto** utiliza o modelo arquitetural orientado a serviços (SOA). Dessa forma, foi construído um sistema único que provê acesso aos recursos por meio de uma API REST utilizando JSON. Os recursos disponibilizados são: authentication, employees, users, attendances, companies, overtimework e workschedule. Acesse `docs/openapi.yml` para mais detalhes de acesso aos endpoints.

Além disso, a aplicação foi desenvolvida com Node.js e TypeScript e PostgreSQL como banco de dados.

### Virtualização
Com o objetivo de manter a homogeneidade de ambientes de desenvolvimento e produção, fez-se o uso do [docker](https://www.docker.com/) para realizar a virtualização da aplicação a nível de sistema operacional e entregar software em pacotes chamados containers. _O docker compartilha o mesmo núcleo com todos os containers em execução, porém cada container possui o seu próprio espaço de usuário, garantindo assim o isolamento de recursos lógicos dos ambientes virtuais._

Além do docker, foi utilizado o [docker-compose](https://docs.docker.com/compose/) para definir, configurar e executar um ambiente com múltiplos containers que precisam conversar entre si.

Acesse o [diagrama de implantação](#diagrama-de-implantação) para obter mais detalhes de como está configurado o ambiente de execução utilizando containers.

### Tolerância a falha
Para garantir maior disponibilidade da aplicação, utilizou-se a opção de `scaling` para executar a API em 4 nós idênticos e simultâneos.

Falando especificamente a nível de implementação, recorremos ao conceito [either](https://blog.logrocket.com/javascript-either-monad-error-handling/), muito conhecido no paradigma de programação funcional, para tratar erros como valores em vez de exceptions, evitando assim, quebras no fluxo principal de execução da aplicação (...).

### Nomeações

### Sincronização

### Consistência

### Replicação

## :runner: Utilização

### Requisitos
- [Docker](https://docs.docker.com/engine/install/)
- [Docker compose](https://docs.docker.com/compose/install/)

### Passo a passo

Com os requisitos devidamente instalados e configurados em sua máquina, siga os passos a seguir para executar a aplicação.

```bash
# crie uma cópia local do repositório:
git clone https://github.com/WeWillWin-W3/ponto.git

# acesse o diretório principal do projeto:
cd ponto

# crie o arquivo configuração da api:
cp ./api/.env.example ./api/.env

# crie o arquivo de configuração do database:
cp ./database/.env.example ./database/.env

# execute os serviços:
docker-compose up --scale api=4
```

Após concluir os passos anteriores, os seguintes recursos ficarão disponíveis:

- **Documentação dos endpoints (swagger):** https://localhost/docs/v1/
- **Documentação dos endpoints (open api):** https://localhost/docs/v1/openapi.yml
- **Enpoints da aplicação (api):** https://localhost/v1/*

### Como utilizar outros clientes de APIs
Caso você não tenha muita experiência com o Swagger ou prefira utilizar outro cliente de APIs como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) é possível configurar tais ferramentas facilmente. Para isso, importe o arquivo `docs/openapi.yml` na sua ferramenta preferida e tenha acesso ao ambiente configurado para os testes.
