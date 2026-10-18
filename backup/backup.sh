
#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

# Check required environment variables
: "${DATABASE_URL:?DATABASE_URL is missing}"
: "${R2_ENDPOINT:?R2_ENDPOINT is missing}"
: "${R2_BUCKET_NAME:?R2_BUCKET_NAME is missing}"
: "${R2_ACCESS_KEY_ID:?R2_ACCESS_KEY_ID is missing}"
: "${R2_SECRET_ACCESS_KEY:?R2_SECRET_ACCESS_KEY is missing}"
: "${BACKUP_AGE_RECIPIENT:?BACKUP_AGE_RECIPIENT is missing}"

# Configure Cloudflare R2 credentials
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"
export AWS_EC2_METADATA_DISABLED=true

# Generate unique backup filename
BACKUP_DATE="$(date -u +%Y-%m-%d_%H-%M-%S)"
BACKUP_NAME="dentist_${BACKUP_DATE}.dump.age"
BACKUP_FILE="/tmp/${BACKUP_NAME}"

# Create temporary database dump
DUMP_FILE="$(mktemp /tmp/dentist-dump.XXXXXX)"

# Remove temporary files when script finishes
trap 'rm -f "$DUMP_FILE" "$BACKUP_FILE"' EXIT

echo "=================================="
echo "Starting Dentist Database Backup"
echo "Date: ${BACKUP_DATE} UTC"
echo "=================================="

# Step 1: Export Neon PostgreSQL database
echo "Step 1: Exporting Neon database..."

pg_dump \
  --dbname="$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-acl \
  --file="$DUMP_FILE"

# Verify database dump
if [ ! -s "$DUMP_FILE" ]; then
    echo "ERROR: Database dump is empty!"
    exit 1
fi

echo "Database exported successfully."

# Step 2: Encrypt database backup
echo "Step 2: Encrypting backup..."

age \
  -r "$BACKUP_AGE_RECIPIENT" \
  -o "$BACKUP_FILE" \
  "$DUMP_FILE"

# Verify encrypted file
if [ ! -s "$BACKUP_FILE" ]; then
    echo "ERROR: Encrypted backup is empty!"
    exit 1
fi

echo "Backup encrypted successfully."

# Delete unencrypted dump
rm -f "$DUMP_FILE"

# Step 3: Upload encrypted backup to R2
echo "Step 3: Uploading backup to Cloudflare R2..."

aws \
  --endpoint-url "$R2_ENDPOINT" \
  s3 cp "$BACKUP_FILE" \
  "s3://${R2_BUCKET_NAME}/daily/${BACKUP_NAME}" \
  --no-progress

echo "=================================="
echo "BACKUP COMPLETED SUCCESSFULLY!"
echo "File: ${BACKUP_NAME}"
echo "Storage: Cloudflare R2"
echo "=================================="
