# AisleMagic

A precision grocery shopping app built for Whole Foods shoppers.

## Project Structure

```
aislemagic/
├── index.html        ← Landing page (yoursite.com)
├── app/
│   └── index.html    ← Mobile app (yoursite.com/app)
├── public/
│   └── favicon.svg   ← App icon
├── vercel.json       ← Vercel routing config
└── README.md
```

## Deploy to Vercel (3 steps)

### Option A — Drag & Drop (Easiest)
1. Go to https://vercel.com and create a free account
2. From your Vercel dashboard, click **Add New → Project**
3. Drag the entire `aislemagic` folder into the upload area
4. Click **Deploy** — done! You get a live URL in ~30 seconds

### Option B — Via Terminal
```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Deploy
cd aislemagic
vercel

# Follow the prompts — takes about 60 seconds
# Your site will be live at: https://aislemagic.vercel.app
```

### Option C — GitHub (Best for ongoing updates)
1. Create a free GitHub account at github.com
2. Create a new repository called `aislemagic`
3. Upload the project files
4. Go to vercel.com → **Add New → Project** → Import from GitHub
5. Select your repo → Deploy
6. Every time you push to GitHub, Vercel auto-deploys ✨

## Add to iPhone Home Screen (feels like a native app)
1. Open Safari on iPhone
2. Go to `yoursite.vercel.app/app`
3. Tap the Share button (box with arrow)
4. Tap **Add to Home Screen**
5. Name it "AisleMagic" → Add

It will appear as an app icon and open fullscreen, just like a native app!

## Custom Domain (Optional)
1. Buy a domain at namecheap.com or godaddy.com (e.g. aislemagic.app)
2. In Vercel dashboard → Your Project → Settings → Domains
3. Add your domain and follow the DNS instructions
4. Done — takes about 10 minutes to go live
