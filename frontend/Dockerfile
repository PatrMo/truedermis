# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "start"]