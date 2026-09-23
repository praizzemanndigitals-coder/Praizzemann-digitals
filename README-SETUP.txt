PRAIZZEMANN DIGITALS — AUTO-PUBLISH SETUP

WHAT THIS VERSION DOES
- The public site reads its published content from Cloudflare Workers KV.
- The private Owner Editor has a Publish Changes button.
- After the one-time Cloudflare setup, edits can be published without rebuilding or uploading the website ZIP.
- The Owner Editor remains private/local and is NOT deployed as public website content.

ONE-TIME CLOUDFLARE SETUP
1. Create a free Cloudflare account.
2. In Workers & Pages, create a Worker application.
3. Create a Workers KV namespace named: praizzemann-site-data
4. Put its namespace ID into wrangler.jsonc in place of:
   REPLACE_WITH_YOUR_KV_NAMESPACE_ID
5. Set a Worker secret named PUBLISH_TOKEN. Choose a long random password/token.
6. Deploy this Worker project with Wrangler:
   npm install -g wrangler
   wrangler login
   wrangler deploy
   (Or use your Git repository/CI deployment.)
7. Note the resulting https://YOUR-WORKER.workers.dev address.
8. Open owner-editor.html locally. In Publish Settings, enter:
   API URL: https://YOUR-WORKER.workers.dev/api/site
   Publish Key: the exact PUBLISH_TOKEN you created.
9. Save settings, then use Publish Changes.

IMPORTANT
- Do not put owner-editor.html inside public/ when deploying.
- The public GET endpoint is intentionally public; only PUT/publishing requires the secret.
- Do not share the Publish Key.
- Cloudflare Workers Free currently includes 100,000 Worker requests/day and Workers KV includes 100,000 reads/day and 1,000 writes/day. See Cloudflare's current pricing docs for limits.
