# Déploiement Kubernetes — MIOLA Shop

Ce guide décrit le déploiement du backend MIOLA Shop sur un cluster Kubernetes local avec Minikube.

> Le frontend React **n'est pas déployé sur Kubernetes** dans cette phase.
> Seul le backend Spring Boot + MySQL est orchestré via K8s.

---

## Architecture déployée

```
┌─────────────────────────────────────────────────────┐
│                  Cluster Minikube                    │
│                                                      │
│  ┌─────────────────┐     ┌─────────────────────┐    │
│  │  Pod MySQL 5.7  │     │  Pod backend x3     │    │
│  │  (1 replica)    │◄────│  miola-backend:1.0  │    │
│  │  PVC 1Gi        │     │  Spring Boot 4.0.5  │    │
│  └─────────────────┘     └──────────┬──────────┘    │
│                                     │ NodePort       │
└─────────────────────────────────────┼────────────────┘
                                      │
                              http://$(minikube ip):NodePort
```

---

## Prérequis

- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installé et démarré
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installé
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) en cours d'exécution

---

## Étapes de déploiement

### 1. Démarrer le cluster Minikube

```bash
minikube start --driver=docker
```

### 2. Encoder votre clé API Groq en base64

**Linux / Mac / Git Bash :**
```bash
echo -n "gsk_votreCleGroqIci..." | base64
```

**PowerShell (Windows) :**
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("gsk_votreCleGroqIci..."))
```

### 3. Mettre à jour le Secret Groq

Ouvrez `k8s/03-groq-secret.yaml` et remplacez `PLACEHOLDER_TO_BE_REPLACED_BASE64`
par la valeur base64 obtenue à l'étape précédente :

```yaml
data:
  api-key: Z3NrX3ZvdHJlQ2xlR3JvcUljaS4uLg==   # exemple
```

### 4. Lancer le déploiement

Depuis la **racine du projet** (`miola-shop/`) :

```batch
k8s\deploy.cmd
```

Ce script :
1. Configure Docker pour pointer vers le daemon de Minikube
2. Build l'image `miola-backend:1.0` localement dans Minikube
3. Applique les 5 manifests YAML dans l'ordre

### 5. Vérifier l'état des pods

```bash
kubectl get pods
kubectl get deployments
kubectl get svc
```

Attendez que tous les pods soient en état `Running` et `Ready`.
MySQL peut prendre ~30 secondes ; le backend attend que MySQL soit prêt.

### 6. Accéder au backend

```bash
minikube service miola-backend-svc --url
```

Cette commande affiche une URL du type `http://127.0.0.1:XXXXX`.
Utilisez cette URL pour accéder à l'API REST.

| Endpoint | URL |
|----------|-----|
| API REST | `<url>/voitures` |
| Actuator | `<url>/actuator/health` |
| Swagger  | `<url>/swagger-ui.html` |

Identifiants : `admin` / `admin123`

### 7. (Optionnel) Dashboard Kubernetes

```bash
minikube dashboard
```

---

## Vérifications utiles

```bash
# Voir les logs d'un pod backend
kubectl logs -l app=miola-backend --tail=50

# Voir les logs MySQL
kubectl logs -l app=mysql --tail=50

# Décrire un pod (debug)
kubectl describe pod <nom-du-pod>

# Lister les secrets (valeurs masquées)
kubectl get secrets
```

---

## Nettoyage

Pour supprimer toutes les ressources K8s créées :

```bash
kubectl delete -f k8s/
```

Pour arrêter Minikube :

```bash
minikube stop
```

---

## Ressources K8s créées

| Fichier | Ressource(s) |
|---------|-------------|
| `01-mysql-configmap.yaml` | ConfigMap `db-config` (DB_HOST, DB_NAME) |
| `02-mysql-secret.yaml` | Secret `mysql-secrets` (username, password) |
| `03-groq-secret.yaml` | Secret `groq-secret` (api-key) |
| `04-db-deployment.yaml` | PVC `mysql-pv-claim` + Deployment `mysql` + Service `mysql` |
| `05-app-deployment.yaml` | Deployment `miola-backend` (3 replicas) + Service `miola-backend-svc` (NodePort) |
