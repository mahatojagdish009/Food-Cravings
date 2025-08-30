# 🌐 RAG Food - External Access Guide

## 🚀 Quick Start Options

### Option 1: Deploy to Vercel (RECOMMENDED)
**Free, fast, and permanent URL**

```bash
# Run the deployment script
./deploy-vercel.sh
```

**Manual Vercel deployment:**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `cd web && vercel --prod`
4. Share the provided URL with anyone!

---

### Option 2: Temporary Public Tunnel (ngrok)
**Instant sharing of your local development**

```bash
# Start your dev server first
npm run dev

# Then in another terminal, run:
./share-local.sh
```

This gives you a temporary URL like: `https://abc123.ngrok.io`

---

### Option 3: Alternative Deployment Platforms

#### Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `cd web && npm run build`
3. Set publish directory: `web/.next`
4. Add environment variables from `.env.production`

#### Railway
1. Connect GitHub repo to Railway
2. Set root directory: `web`
3. Railway auto-detects Next.js
4. Add environment variables

---

## 🔧 Environment Setup for Production

When deploying, make sure to set these environment variables:

- `UPSTASH_VECTOR_REST_TOKEN`
- `UPSTASH_VECTOR_REST_READONLY_TOKEN` 
- `UPSTASH_VECTOR_REST_URL`
- `GROQ_API_KEY`
- `OLLAMA_BASE_URL` (update for production)
- `EMBED_MODEL`
- `LLM_MODEL`

---

## 🌍 Access Your App

After deployment, your RAG Food app will be accessible at:
- **Vercel**: `https://your-app-name.vercel.app`
- **ngrok**: `https://random-id.ngrok.io` (temporary)
- **Custom Domain**: Set up after deployment

Share this URL with anyone worldwide! 🎉

---

## 🛠 Troubleshooting

### Common Issues:
1. **Environment Variables**: Ensure all env vars are set in your deployment platform
2. **Ollama URL**: Update `OLLAMA_BASE_URL` for production (use cloud service)
3. **Build Errors**: Check that all dependencies are in `package.json`

### Test Your Deployment:
- Visit the URL in different browsers
- Test from different networks/devices
- Check developer console for any errors