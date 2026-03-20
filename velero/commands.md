# Velero Backup & Restore Guide

## Install Velero
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.7.0 \
  --bucket velero-backups \
  --secret-file ./credentials-velero \
  --use-node-agent

---

## Check Velero
kubectl get pods -n velero
velero backup get

---

## Take Backup
velero backup create file-upload-backup --default-volumes-to-fs-backup

---

## Delete Application
kubectl delete namespace file-upload-app

---

## Restore Application
velero restore create --from-backup file-upload-backup

---

## Verify Restore
kubectl get pods -n file-upload-app
