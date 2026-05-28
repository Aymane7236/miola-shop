@echo off
echo === Configuration de Docker pour Minikube ===
@FOR /f "tokens=*" %%i IN ('minikube -p minikube docker-env --shell cmd') DO @%%i

echo === Build de l'image backend ===
cd backend
docker build -t miola-backend:1.0 .
cd ..

echo === Application des manifests Kubernetes ===
kubectl apply -f k8s/01-mysql-configmap.yaml
kubectl apply -f k8s/02-mysql-secret.yaml
kubectl apply -f k8s/03-groq-secret.yaml
kubectl apply -f k8s/04-db-deployment.yaml
kubectl apply -f k8s/05-app-deployment.yaml

echo === Etat du deploiement ===
kubectl get deployments
kubectl get pods
kubectl get svc

echo.
echo === Pour acceder au backend ===
echo Lancez : minikube service miola-backend-svc --url
