#!/bin/bash

# Deployment Script for Collaborative Developments
# This script deploys the Next.js application to Google Cloud Run
# Uses Artifact Registry for container image storage

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="innate-solution-475919-n9"
SERVICE_NAME="collaborative-developments"
REGION="${GCP_REGION:-us-central1}"
REPOSITORY_NAME="docker-repo"  # Artifact Registry repository name
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/$SERVICE_NAME"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Collaborative Developments - Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if required tools are installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v gcloud >/dev/null 2>&1 || { echo -e "${RED}Error: gcloud CLI is not installed${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Error: Docker is not installed${NC}" >&2; exit 1; }
echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Verify environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_SUPABASE_URL environment variable is not set${NC}"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables verified${NC}"
echo ""

# Set the project
echo -e "${YELLOW}Setting GCP project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID
echo ""

# Enable required APIs
echo -e "${YELLOW}Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Create Artifact Registry repository if it doesn't exist
echo -e "${YELLOW}Setting up Artifact Registry repository...${NC}"
if gcloud artifacts repositories describe $REPOSITORY_NAME --location=$REGION &>/dev/null; then
    echo -e "${GREEN}✓ Repository already exists${NC}"
else
    echo -e "${YELLOW}Creating new Artifact Registry repository...${NC}"
    gcloud artifacts repositories create $REPOSITORY_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for Collaborative Developments"
    echo -e "${GREEN}✓ Repository created${NC}"
fi
echo ""

# Configure Docker to use gcloud for authentication
echo -e "${YELLOW}Configuring Docker authentication...${NC}"
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet
echo -e "${GREEN}✓ Docker authentication configured${NC}"
echo ""

# Build the Docker image locally with build arguments
echo -e "${YELLOW}Building Docker image...${NC}"
docker build \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -t $IMAGE_NAME:latest \
    .
echo -e "${GREEN}✓ Image built successfully${NC}"
echo ""

# Push the Docker image to Artifact Registry
echo -e "${YELLOW}Pushing image to Artifact Registry...${NC}"
docker push $IMAGE_NAME:latest
echo -e "${GREEN}✓ Image pushed successfully${NC}"
echo ""

# Deploy to Cloud Run
echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo -e "${GREEN}Your application is live at:${NC}"
echo -e "${YELLOW}$SERVICE_URL${NC}"
echo ""
