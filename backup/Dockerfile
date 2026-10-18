
FROM postgres:18-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    awscli \
    age \
    bash \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backup.sh /app/backup.sh

RUN chmod +x /app/backup.sh

ENTRYPOINT ["/bin/bash", "/app/backup.sh"]
