
FROM node:18-alpine3.15

RUN apk update && apk add sudo

ENV PORT 443
ENV HOST 0.0.0.0

WORKDIR /src
COPY /api /src

# Install app dependencies
# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR

#COPY package.json ./
#COPY ["api/app","./"]
##COPY ["app","*.json",".env","entrypoint.sh","codegen.ts", "./"]
#COPY ["api/app","api/package.json", "api/package-lock.json", "api/tsconfig.json","api/tsconfig.package.json","api/.env","api/entrypoint.sh", "./"]


RUN npm install
WORKDIR /src


#RUN npm run build

RUN npm run build:gql 
#ADD entrypoint.sh /
# RUN chmod +x /entrypoint.sh 

EXPOSE $PORT

CMD ["npm", "run", "dev"]
#