# Image cgiiise/linux server
From node:22-alpine

WORKDIR /app

# Copy source (current)  destination (docker)
COPY package*.json ./

# Schell/ Terminal command


RUN npm install

#copy rest of the source code


COPY . .
# Docker port
EXPOSE 5050

# Entry point (run server)
CMD ["node", "server.js"]


# docker build -t backend-app.
# docker run -d -p 5050:5050 --name backend backend-app
# docker ps -a
# docker stop CONTAINERID
# docker rm CONATINERID