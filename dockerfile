# Usar imagem oficial do Node.js
FROM node:14

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "node", "index.js" ]
