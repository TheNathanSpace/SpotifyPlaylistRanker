#!/bin/bash

export $(xargs </app/.env)

if [ -z "${REACT_APP_PORT}" ]; then
  REACT_APP_PORT=3000
  export REACT_APP_PORT
fi

if [ ! -f ".env" ]; then
  ln -s .env frontend/.env
fi

(cd /app/backend && python app.py) & (cd /app/frontend && REACT_APP_BACKEND_PORT="$backend_port" npm start -- --port "$REACT_APP_PORT") & wait -n
