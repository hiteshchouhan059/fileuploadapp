# Velero Integration

This project uses Velero for backup and restore of:

- Kubernetes resources
- Persistent volumes (files + PostgreSQL data)

## Features

- Backup of full application
- Restore after deletion
- File storage persistence
- PostgreSQL data persistence (via PVC)

## Notes

- Files are successfully restored from PVC backups
- PostgreSQL requires initialization script for table creation
- Velero uses node-agent for volume backup

## Status

- Backup: Working
- Restore: Working
- File recovery: Working
- DB recovery: Configured with init script
