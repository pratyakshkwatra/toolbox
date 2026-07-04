FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# We don't build in development phase, we just run next dev
CMD ["npm", "run", "dev"]
