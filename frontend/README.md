# ☸️ Tutorial: Deploying a Three-Tier App on Kubernetes (Minikube)

This guide documents the process of migrating a standard Three-Tier application (React, Node.js, PostgreSQL) from Docker Compose to a local Kubernetes cluster using Minikube.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**
* **[Minikube](https://minikube.sigs.k8s.io/docs/start/)** (Local Kubernetes Cluster)
* **[kubectl](https://kubernetes.io/docs/tasks/tools/)** (Kubernetes Command Line Tool)

---

## 🚀 Step 1: Start the Cluster

First, we need to spin up our "Island" — the virtual machine that will run our Kubernetes cluster.

```bash
minikube start
Note for Windows users: If you run into issues, try minikube start --driver=docker.

🏗️ Step 2: Build Images Locally
The "Island" Rule: Since Minikube runs in its own isolated environment (a VM or container), it cannot see the Docker images on your laptop by default. We must point our terminal inside Minikube to build the images there.

Instead of pushing to Docker Hub, we will build directly into Minikube's cache.

1. Build Backend
Bash

minikube image build -t three-tier-backend:latest ./backend
2. Build Frontend
Bash

minikube image build -t three-tier-frontend:latest ./frontend
🗄️ Step 3: Deploy the Database
The database requires persistent storage so data survives pod restarts.

1. Create Persistent Volume Claim (PVC)
Ensures your data is saved to a "virtual hard drive." k8s/database-pvc.yaml

2. Deploy PostgreSQL
k8s/database-deployment.yaml

3. Expose Database (Internal Service)
Creates a stable internal IP for the backend to find the database. k8s/database-service.yaml

Run Command:

Bash

kubectl apply -f k8s/database-pvc.yaml
kubectl apply -f k8s/database-deployment.yaml
kubectl apply -f k8s/database-service.yaml
⚙️ Step 4: Deploy the Backend & Open Tunnel
The backend needs to run and be accessible by the frontend.

1. Deploy Backend
k8s/backend-deployment.yaml

2. Expose Backend (NodePort)
k8s/backend-service.yaml

Run Command:

Bash

kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
3. Open the Backend Tunnel (Crucial for Windows/WSL)
On local environments (especially Windows), the "NodePort" is not directly accessible via localhost. We must create a tunnel.

Open a NEW terminal window.

Run the tunnel command:

Bash

minikube service backend
Keep this window open! Copy the URL provided (e.g., http://127.0.0.1:41677). You will need this for the next step.

🎨 Step 5: Configure & Deploy Frontend
The Frontend (React) runs in the user's browser, so it needs the External URL (the tunnel) to talk to the backend.

1. Update Configuration
Open k8s/frontend-deployment.yaml and update the environment variable with the URL you copied in Step 4.

YAML

    env:
    - name: VITE_API_URL
      value: "[http://127.0.0.1:41677](http://127.0.0.1:41677)" # <-- REPLACE THIS with your Tunnel URL
2. Deploy Frontend
Bash

kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
🌐 Step 6: Access the Application
Now we need one final tunnel to actually view the website.

Open another NEW terminal window.

Run the tunnel command for the frontend:

Bash

minikube service frontend
Your default browser should open automatically. If not, click the URL provided in the terminal.

🧪 Step 7: Verification & Scaling
Check Health
Ensure all pods are Running and fully ready (1/1).

Bash

kubectl get pods
Test Scaling (The Power of K8s)
Simulate high traffic by running 3 copies of the backend instantly.

Bash

kubectl scale deployment backend --replicas=3
Watch them start up in real-time:

Bash

kubectl get pods -w
Simulate Failure (Chaos Monkey)
Delete a pod to see Kubernetes automatically heal the system.

Bash

kubectl delete pod <backend-pod-name>
🧹 Cleanup
To save battery and resources when you are finished:

Stop Tunnels: Press Ctrl+C in the terminal windows running minikube service ....

Stop Cluster:

Bash

minikube stop
Delete Cluster (Optional): If you want to wipe all data and start fresh next time:

Bash

minikube delete