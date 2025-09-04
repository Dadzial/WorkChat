FROM node:20.13.1-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ .
RUN npm run build -- --configuration production

FROM node:20.13.1-alpine as backend-builder

WORKDIR /app/backend

COPY backend/api/package*.json ./

RUN npm install --legacy-peer-deps \
    mongoose@6.10.0 \
    @types/mongoose@5.11.97

RUN npm install --legacy-peer-deps

COPY backend/api/ .

RUN npx tsc --skipLibCheck

FROM node:20.13.1-alpine

WORKDIR /app

COPY --from=backend-builder /app/backend/package*.json ./backend/

RUN cd backend && \
    npm install --production --legacy-peer-deps \
    mongoose@6.10.0

COPY --from=backend-builder /app/backend/dist ./backend/dist

RUN mkdir -p /frontend/dist/frontend/browser
COPY --from=frontend-builder /app/frontend/dist/frontend/browser /frontend/dist/frontend/browser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3100
EXPOSE 3100

WORKDIR /app/backend
CMD ["node", "dist/index.js"]