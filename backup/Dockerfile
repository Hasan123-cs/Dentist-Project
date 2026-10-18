
FROM alpine:3.22

RUN apk add --no-cache \
    postgresql18-client \
    aws-cli \
    age \
    bash \
    ca-certificates \
    tzdata

WORKDIR /app

COPY backup.sh /app/backup.sh

RUN chmod +x /app/backup.sh

CMD ["/bin/bash", "/app/backup.sh"]
