# Commands

# 1. Initialize a new Node.js project (creates package.json)
npm init -y

# 2. Install Dependancies

```
npm install express  
npm install swagger-ui-express  
npm install @prisma/client  
npm install prisma --save-dev  
npm install -D typescript  
npm install -D ts-node-dev
npm install -D @types/node  
npm install -D @types/express  
npm install -D @types/swagger-ui-express  
npm install -D swagger-autogen  
npm install -D swagger-jsdoc  

npm install express-session  
npm install connect-redis  
npm install ioredis
npm install -D @types/express-session
```

# 3. Initialize TypeScript configuration file (tsconfig.json)
npx tsc --init

## Docker Commands

Start Docker Container
```
docker compose up --build -d
```

## Run Prisma Studio manually 
```
npx prisma studio
docker exec -it express_api npx prisma studio
```