FROM python:3.10

# Build the React front-end app
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
WORKDIR /app/frontend
COPY --chown=65536 --chmod=774 frontend/ /app/frontend
RUN npm install

# Build the Flask back-end app
WORKDIR /app/backend
COPY --chown=65536 --chmod=774  backend/ /app/backend
RUN pip install -r requirements.txt

COPY --chown=65536 --chmod=774  data/ /app/data
COPY --chown=65536 --chmod=774  start_internal.bash /app/start_internal.bash

CMD ["bash", "/app/start_internal.bash"]
