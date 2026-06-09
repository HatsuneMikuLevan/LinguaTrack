# Используем легкую официальную версию Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt .

# Устанавливаем библиотеки
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь остальной код бэкенда
COPY . .

# Открываем порт 8000 для FastAPI
EXPOSE 8000

# Запускаем сервер uvicorn на хосте 0.0.0.0, чтобы он был доступен снаружи контейнера
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]