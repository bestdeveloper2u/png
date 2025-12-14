# =======================================================
# STEP 1: BUILD NEXT.JS
# =======================================================
FROM node:22-alpine

WORKDIR /app

ENV NODE_OPTIONS="--max_old_space_size=2048"

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js production site
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start Node.js server
CMD ["npm", "run", "start"]
