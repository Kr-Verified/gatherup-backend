# Cloud Run CI/CD

This backend is deployed by Cloud Build from GitHub to Cloud Run.

## One-time setup

Enable APIs:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
```

Create the Artifact Registry repository:

```bash
gcloud artifacts repositories create gatherup \
  --repository-format=docker \
  --location=asia-northeast3
```

Create runtime secrets:

```bash
printf '%s' 'YOUR_SUPABASE_POOLER_DATABASE_URL' | gcloud secrets create gatherup-database-url --data-file=-
printf '%s' 'YOUR_32_PLUS_CHAR_JWT_SECRET' | gcloud secrets create gatherup-jwt-secret --data-file=-
```

Grant Cloud Build permission to deploy to Cloud Run and read secrets:

```bash
PROJECT_ID="$(gcloud config get-value project)"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/artifactregistry.writer"

gcloud secrets add-iam-policy-binding gatherup-database-url \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding gatherup-jwt-secret \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/secretmanager.secretAccessor"
```

## Cloud Build trigger

Create a GitHub trigger in Google Cloud Build:

- Event: push to branch
- Branch: `^main$`
- Build config file: `cloudbuild.yaml` if this repo root is `backend`, or `backend/cloudbuild.yaml` if this is a monorepo.
- Substitutions can override `_REGION`, `_REPOSITORY`, `_SERVICE`, `_FRONTEND_ORIGIN`, and scaling settings.

After the first successful deploy, set Netlify:

```env
NEXT_PUBLIC_API_URL=https://YOUR_CLOUD_RUN_URL
```
