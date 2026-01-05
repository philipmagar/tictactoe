
<<<<<<< HEAD
=======
## Deploy to Render (Backend + Database)

### 1. Create a Render Account
- Go to [render.com](https://render.com) and sign up with GitHub

### 2. Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `tictactoe-db`
3. Select Free tier
4. Click "Create Database"
5. **Copy the Internal Database URL** (you'll need this)
postgresql://tictactoe_db_alp3_user:1sal09VHxlRlahZYadW4JWbs80lhLziV@dpg-d5djggm3jp1c73etakpg-a/tictactoe_db_alp3
### 3. Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `philipmagar/tictactoe`
3. Configure:
   - **Name**: `tictactoe-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
   - `DATABASE_URL` = (paste the Internal Database URL from step 2)
   - `JWT_SECRET` = (any random string, e.g., `your-super-secret-jwt-key-12345`)
   - `NODE_ENV` = `production`

5. Click "Create Web Service" 

6. Once deployed, **copy your backend URL** (e.g., `https://tictactoe-backend.onrender.com`)

### 4. Initialize Database
After backend is deployed, run the database schema:
1. Go to your database dashboard on Render
2. Click "Connect" → "External Connection"
3. Use a PostgreSQL client or the web shell to run the SQL from `server/database.sql`

## Deploy to Vercel (Frontend)

### 1. Install Vercel CLI (optional)
```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import `philipmagar/tictactoe`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   - `REACT_APP_BACKEND_URL` = (your Render backend URL from step 3.6)

6. Click "Deploy"

### 3. Done! 🎉
Your app is now live! Vercel will give you a URL like `https://tictactoe-xyz.vercel.app`

## Important Notes

- **Free tier limitations**:
  - Render free tier spins down after 15 minutes of inactivity (first request may be slow)
  - Database has 1GB storage limit
  
- **Custom Domain** (optional):
  - You can add a custom domain in both Vercel and Render settings

- **CORS**: The backend is already configured to accept requests from any origin (`cors()`)

## Troubleshooting

If the frontend can't connect to backend:
1. Check that `REACT_APP_BACKEND_URL` in Vercel matches your Render backend URL
2. Ensure backend URL includes `https://` and no trailing slash
3. Check Render logs for backend errors
4. Verify database is running and connected
>>>>>>> 99e5240 (fix deployment routing)
