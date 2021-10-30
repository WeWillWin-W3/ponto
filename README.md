<div align="center">
<img src=".github/assets/logo.png" width="200" />

Aplicação marcação de ponto e monitoramento de jornadas de trabalho
</div>

## Visão geral

## Utilização

Siga os passos a seguir para executar a aplicação.
```bash
# crie o arquivo configuração da api:
cp ./api/.env.example ./api/.env

# crie o arquivo de configuração do database:
cp ./database/.env.example ./database/.env

# execute os serviços
docker-compose up --scale api=4
```

Após cumprir os passos anteriores, os seguintes recursos ficarão disponíveis:

- **Documentação dos endpoints (swagger):** https://localhost/docs/v1/
- **Documentação dos endpoints (open api):** https://localhost/docs/v1/openapi.yml
- **Enpoints da aplicação (api):** https://localhost/v1/*
