# Mohammed Huzaif Portfolio

A static portfolio built with HTML, CSS, and vanilla JavaScript. It has no package installation or build step; `index.html` is the site entry point.

## Preview locally

Run this from the portfolio folder with Python 3 installed:

```powershell
python -m http.server 8000
```

Open <http://localhost:8000> in a browser. Serving over HTTP also allows the video and lazy-loaded images to load as they will after deployment.

## Deploy with GitHub Pages

1. Create a GitHub repository for the portfolio. For a personal site URL, name it `<username>.github.io`; otherwise, the URL includes the repository name.
2. Open PowerShell in this folder and initialize and push the site:

   ```powershell
   git init
   git add .
   git commit -m "Deploy portfolio site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repository>.git
   git push -u origin main
   ```

   Replace `<username>` and `<repository>` with the values for your GitHub account and repository.
3. In the GitHub repository, open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Wait for the Pages deployment to finish. The site URL appears on the Pages settings screen. A project site is usually `https://<username>.github.io/<repository>/`.

No Jekyll configuration or build command is required. Keep `index.html`, `style.css`, `script.js`, and the media files together in the published root. Asset paths are relative, so the site also works beneath a repository path.

## Other static hosts

Connect the GitHub repository to Netlify, Cloudflare Pages, or another static host. Leave the build command empty and set the publish/output directory to the repository root (`.`). For a manual upload, publish the contents of this folder.

## Before publishing

- Keep the bundled images, `self intro.mp4`, and `Huzaif_resume (1) (1).pdf` in this folder; filenames and letter case must match their references.
- The interface has a local simulated chat assistant. The contact form validates fields and shows a demo confirmation but does not send email. Connect a server-side endpoint before representing messages as delivered; keep any email-provider API key in server-side configuration, never in `script.js`.
- Google Fonts are loaded from Google at runtime. The CSS includes fallback font stacks if that request is unavailable.
- Test the deployed URL on desktop and mobile, then verify the resume download, video playback, project dialogs, navigation, and contact form behavior.
