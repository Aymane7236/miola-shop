# MIOLA Shop — Concession Automobile avec Assistant IA

## 1. Présentation

**MIOLA Shop** est une application web complète de gestion d'une concession automobile marocaine.
Elle combine un **catalogue CRUD de voitures** et un **assistant IA conversationnel** capable de répondre aux questions sur l'inventaire, propulsé par le modèle `llama-3.1-8b-instant` via l'[API Groq](https://groq.com/) (gratuite, cloud, aucune installation locale).

L'application est entièrement conteneurisée avec Docker Compose pour un déploiement reproductible en **1 commande**.

---

## 2. Architecture

```
┌──────────────────────────────────────────────────┐
│                  Navigateur                       │
│            http://localhost:5173                  │
└────────────────────┬─────────────────────────────┘
                     │ HTTP
┌────────────────────▼─────────────────────────────┐
│         frontend (nginx:alpine, port 80)          │
│  • Sert le build React                            │
│  • Proxy /api/* et /voitures → backend:8080       │
└────────────────────┬─────────────────────────────┘
                     │ HTTP interne
┌────────────────────▼─────────────────────────────┐
│     backend (Spring Boot 4.0.5, port 8080)        │
│  • CRUD Voitures — REST /voitures                 │
│  • Chat IA      — POST /api/chat                  │
│  • H2 in-memory + Spring Security (Basic Auth)    │
└────────────────────┬─────────────────────────────┘
                     │ HTTPS (API cloud)
┌────────────────────▼─────────────────────────────┐
│        API Groq — api.groq.com                    │
│  • Modèle llama-3.1-8b-instant                   │
│  • Gratuit, pas d'installation, < 1s de latence   │
└──────────────────────────────────────────────────┘
```

---

## 3. Prérequis

### 3.1 Docker Desktop
- Windows/Mac : https://www.docker.com/products/docker-desktop/
- Linux : `sudo apt install docker.io docker-compose-plugin`
- Au moins **1 Go d'espace disque libre** (images légères, pas de modèle local)
- Au moins **2 Go de RAM** disponible pour Docker

### 3.2 Clé API Groq (gratuite, sans carte bancaire)

1. Créer un compte sur **https://console.groq.com/login**
   (connexion avec Google ou GitHub, aucune carte bancaire requise)
2. Aller sur **https://console.groq.com/keys** → cliquer **"Create API Key"**
3. Copier la clé générée (elle commence par `gsk_...`)
4. À la racine du projet, copier le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```
5. Ouvrir `.env` et remplacer `gsk_xxxxxx...` par votre vraie clé

---

## 4. Lancement rapide

```bash
git clone https://github.com/Aymane7236/miola-shop.git
cd miola-shop
cp .env.example .env       # puis éditer .env pour y mettre votre GROQ_API_KEY
docker compose up --build
```

> **Note Windows :** si `docker compose` n'est pas reconnu, essayez `docker-compose up --build`

---

## 5. Premier démarrage

Au premier lancement, Docker va télécharger uniquement les images légères :

| Élément | Taille approximative |
|---------|---------------------|
| Image `eclipse-temurin:17-jre-alpine` | ~180 Mo |
| Image `node:20-alpine` + dépendances npm | ~400 Mo |
| Dépendances Maven (cache Docker) | ~200 Mo |

**Durée estimée : 2 à 5 minutes** selon votre connexion internet.
(Plus de 1.3 Go de modèle IA à télécharger — l'IA est dans le cloud Groq !)

Attendez de voir dans les logs :
```
miola-backend  | Started FullstackApplication in X.XXX seconds
miola-frontend | /docker-entrypoint.sh: Configuration complete
```

---

## 6. Accès à l'application

| Service | URL |
|---------|-----|
| **Frontend** (interface principale) | http://localhost:5173 |
| **Backend API** (JSON direct) | http://localhost:8080 |
| **Documentation Swagger** | http://localhost:8080/swagger-ui.html |
| **Console H2** (base de données) | http://localhost:8080/h2-console |

### Identifiants
| Champ | Valeur |
|-------|--------|
| Utilisateur | `admin` |
| Mot de passe | `admin123` |

---

## 7. Fonctionnalités

### Gestion du catalogue (CRUD)
- **Lister** toutes les voitures du stock (10 voitures marocaines pré-chargées)
- **Ajouter** une nouvelle voiture (marque, modèle, couleur, immatricule, année, prix)
- **Modifier** les informations d'une voiture existante
- **Supprimer** une voiture du catalogue

### Assistant IA
L'assistant connaît l'inventaire en temps réel et répond en français.

Exemples de questions à poser :
- *"Quelle est la voiture la moins chère ?"*
- *"Avez-vous des voitures noires disponibles ?"*
- *"Combien coûte la BMW Série 3 ?"*
- *"Quelles voitures sont disponibles en dessous de 150 000 DH ?"*

---

## 8. Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite 6 + Bootstrap 5 |
| Backend | Spring Boot 4.0.5 + Spring Security + Spring Data JPA |
| Base de données | H2 (in-memory, réinitialisée à chaque redémarrage) |
| Assistant IA | API Groq + llama-3.1-8b-instant (cloud, gratuit) |
| Serveur web | nginx:alpine |
| Conteneurisation | Docker Compose |

---

## 9. Auteur

**EDDAOUDI Mohamed Aymane**
Étudiant en Master DSS (Décision et Systèmes Intelligents) — ENSIAS, Rabat

---

## 10. Note pédagogique — API Groq et confidentialité

L'API Groq est utilisée en mode **cloud** : les questions posées dans l'interface de chat transitent par les serveurs de Groq pour inférence. Le modèle `llama-3.1-8b-instant` offre :

- **Raisonnement nettement supérieur** au modèle local 1B précédent
- **Latence < 1 seconde** (inférence GPU massivement parallèle)
- **Gratuit** sur le tier free (limites généreuses pour usage pédagogique)

Pour un déploiement production sans dépendance cloud, il est possible de revenir à Ollama en local en réintroduisant les services dans docker-compose.yml.
