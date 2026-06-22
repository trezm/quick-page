import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateId, generateEditToken, createPage, getPage, updatePage, incrementViews, getStats } from './db.js';
import { createPageTemplate, editPageTemplate, renderPageTemplate, passwordPageTemplate, statsPageTemplate, pageStatsTemplate } from './templates.js';
import { setupMcp } from './mcp.js';

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || crypto.randomBytes(32).toString('hex');

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

setupMcp(app);

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.send(createPageTemplate());
});

app.post('/api/pages', async (req, res) => {
  try {
    const { code, password } = req.body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    const id = generateId();
    const editToken = generateEditToken();
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    createPage(id, code, passwordHash, editToken);

    const host = req.get('host') || 'quick-page.petemertz.com';
    const proto = req.get('x-forwarded-proto') || req.protocol;
    res.json({
      id,
      url: `${proto}://${host}/p/${id}`,
      editUrl: `${proto}://${host}/e/${id}/${editToken}`,
    });
  } catch (e) {
    console.error('Error creating page:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/p/:id', (req, res) => {
  const page = getPage(req.params.id);

  if (!page) {
    res.status(404).send('Page not found');
    return;
  }

  if (page.password_hash) {
    const authCookie = req.signedCookies[`qp_${page.id}`];
    if (authCookie !== 'authorized') {
      res.send(passwordPageTemplate(page.id));
      return;
    }
  }

  incrementViews(page.id);
  res.send(renderPageTemplate(page.tsx_code));
});

app.get('/p/:id/stats', (req, res) => {
  const page = getPage(req.params.id);
  if (!page) {
    res.status(404).send('Page not found');
    return;
  }
  res.send(pageStatsTemplate(page));
});

app.get('/stats', (_req, res) => {
  res.send(statsPageTemplate(getStats()));
});

app.post('/p/:id/auth', async (req, res) => {
  try {
    const page = getPage(req.params.id);

    if (!page) {
      res.status(404).send('Page not found');
      return;
    }

    if (!page.password_hash) {
      res.redirect(`/p/${page.id}`);
      return;
    }

    const { password } = req.body;
    const valid = await bcrypt.compare(password || '', page.password_hash);

    if (!valid) {
      res.send(passwordPageTemplate(page.id, 'Invalid password'));
      return;
    }

    res.cookie(`qp_${page.id}`, 'authorized', {
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`/p/${page.id}`);
  } catch (e) {
    console.error('Error authenticating:', e);
    res.status(500).send('Internal server error');
  }
});

app.get('/e/:id/:token', (req, res) => {
  const page = getPage(req.params.id);
  if (!page || !page.edit_token || page.edit_token !== req.params.token) {
    res.status(404).send('Page not found');
    return;
  }
  res.send(editPageTemplate(page.id, page.edit_token, page.tsx_code, !!page.password_hash));
});

app.post('/api/pages/:id/edit', async (req, res) => {
  try {
    const { token, code, password, clearPassword } = req.body;
    const page = getPage(req.params.id);

    if (!page || !page.edit_token || page.edit_token !== token) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    let passwordHash = page.password_hash;
    if (clearPassword) {
      passwordHash = null;
    } else if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    updatePage(page.id, code, passwordHash);

    const host = req.get('host') || 'quick-page.petemertz.com';
    const proto = req.get('x-forwarded-proto') || req.protocol;
    res.json({
      id: page.id,
      url: `${proto}://${host}/p/${page.id}`,
      editUrl: `${proto}://${host}/e/${page.id}/${page.edit_token}`,
    });
  } catch (e) {
    console.error('Error updating page:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Quick Page running on port ${PORT}`);
});
