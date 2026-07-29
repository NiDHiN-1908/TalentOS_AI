terraform {
  required_version = ">= 1.6.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "talentos_prod" {
  metadata {
    name = "talentos-production"
    labels = {
      environment = "production"
      platform    = "talentos-ai"
    }
  }
}

# PostgreSQL Database Service
resource "kubernetes_service" "postgres_service" {
  metadata {
    name      = "postgres-service"
    namespace = kubernetes_namespace.talentos_prod.metadata[0].name
  }
  spec {
    selector = {
      app = "postgres"
    }
    port {
      port        = 5432
      target_port = 5432
    }
  }
}

# Redis Cache Service
resource "kubernetes_service" "redis_service" {
  metadata {
    name      = "redis-service"
    namespace = kubernetes_namespace.talentos_prod.metadata[0].name
  }
  spec {
    selector = {
      app = "redis"
    }
    port {
      port        = 6379
      target_port = 6379
    }
  }
}
