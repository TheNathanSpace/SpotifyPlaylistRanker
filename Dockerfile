# Stage 1: Build the React front-end app
FROM node:18 as frontend
WORKDIR /app/frontend
COPY frontend/package*.json /app/frontend
RUN npm install
COPY frontend/ /app/frontend
RUN npm run build

# Stage 2: Build the Flask back-end app
FROM python:3.10 as backend
WORKDIR /app/backend
COPY backend/requirements.txt /app/backend
RUN pip install -r requirements.txt
COPY backend/ /app/backend

# Stage 3: Combine both apps in a single container
FROM python:3.10
# Install Node.js and npm
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
COPY --from=frontend /app/frontend/ /app/frontend
COPY --from=backend /app/backend/ /app/backend
COPY data/ /app/data
COPY start_internal.bash /app/start_internal.bash

CMD ["bash", "/app/start_internal.bash"]
