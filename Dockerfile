#frontend
FROM node:18-alpine as frontend-builder

WORKDIR /frontend

COPY frontend/*.json ./

RUN npm install

COPY frontend .

RUN npm run build

# backend
FROM python:3.9-alpine

WORKDIR /app

COPY . .

RUN python3 -m venv /opt/venv && source /opt/venv/bin/activate && /opt/venv/bin/pip install --upgrade pip && /opt/venv/bin/pip install --upgrade pip && pip install -r requirements.txt

RUN chmod +x entrypoint.sh

COPY --from=frontend-builder /frontend/dist /app/frontend/dist

CMD ["./entrypoint.sh"]