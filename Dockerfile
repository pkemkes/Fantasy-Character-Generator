# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
ENV CI=true
WORKDIR /app/frontend
RUN npm install -g pnpm
COPY frontend/ ./
RUN pnpm install
RUN pnpm run build

# Stage 2: Runtime
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./static
EXPOSE 8000
VOLUME ["/app/data"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
