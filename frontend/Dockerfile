FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the standard Vite port
EXPOSE 3000

# Start the dev server with host binding
CMD ["npm", "run", "dev", "--", "--host"]