import mongoose from 'mongoose';
import https from 'https';
import { env } from './env';

const queryDoH = (name: string, type: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
};

const resolveSrvUri = async (uri: string): Promise<string> => {
  if (!uri.startsWith('mongodb+srv://')) return uri;

  try {
    const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(?:\/([^?]*))?(?:\?(.*))?$/);
    if (!match) return uri;

    const [, user, pass, host, dbName, queryParams] = match;
    const srvName = `_mongodb._tcp.${host}`;

    const [srvRes, txtRes] = await Promise.all([
      queryDoH(srvName, 'SRV').catch(() => null),
      queryDoH(host, 'TXT').catch(() => null)
    ]);

    if (!srvRes?.Answer || srvRes.Answer.length === 0) return uri;

    const hosts = srvRes.Answer.map((a: { data: string }) => {
      const parts = a.data.split(' ');
      const target = parts[parts.length - 1].replace(/\.$/, '');
      const port = parts[parts.length - 2];
      return `${target}:${port}`;
    });

    let extraParams = '';
    if (txtRes?.Answer && txtRes.Answer.length > 0) {
      extraParams = txtRes.Answer.map((a: { data: string }) => a.data.replace(/^"|"$/g, '')).join('&');
    }

    const db = dbName || '';
    const paramsList = [
      'ssl=true',
      'authSource=admin',
      extraParams,
      queryParams || 'retryWrites=true&w=majority'
    ].filter(Boolean);

    const paramMap = new Map<string, string>();
    for (const p of paramsList.join('&').split('&')) {
      if (!p) continue;
      const [k, v] = p.split('=');
      if (k && !paramMap.has(k)) paramMap.set(k, v || '');
    }
    const finalQuery = Array.from(paramMap.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return `mongodb://${user}:${pass}@${hosts.join(',')}/${db}?${finalQuery}`;
  } catch {
    return uri;
  }
};

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  let targetUri = env.mongoUri;

  try {
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 8000 });
    console.info('MongoDB connected');
    return;
  } catch (initialErr: any) {
    if (targetUri.startsWith('mongodb+srv://')) {
      console.warn('Initial SRV connection failed, attempting fallback DNS resolution...');
      const fallbackUri = await resolveSrvUri(targetUri);
      if (fallbackUri !== targetUri) {
        await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 8000 });
        console.info('MongoDB connected via fallback resolution');
        return;
      }
    }
    throw initialErr;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
