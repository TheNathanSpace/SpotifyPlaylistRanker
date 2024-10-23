#!/bin/bash

export $(xargs </app/.env)

if [ -z "${frontend_port}" ]; then
  frontend_port=3000
  export frontend_port
fi

cd /app/backend && python app.py & cd /app/frontend && npm start -- --port "$frontend_port" & wait -n
