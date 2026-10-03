import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFilePath = resolve(projectRoot, '.env');
const generatedFilePath = resolve(
  projectRoot,
  'src/environments/environment.generated.ts',
);

function readDotEnv(filePath) {
  let contents;

  try {
    contents = readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }

  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const entry = line.replace(/^export\s+/, '');
        const separatorIndex = entry.indexOf('=');
        if (separatorIndex === -1) {
          return null;
        }

        const key = entry.slice(0, separatorIndex).trim();
        let value = entry.slice(separatorIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        return [key, value];
      })
      .filter(Boolean),
  );
}

const localEnv = readDotEnv(envFilePath);
const backendUrl = process.env.BACKEND_API_URL ?? localEnv.BACKEND_API_URL;
const apiSlug = process.env.BACKEND_API_URL_SLUG ?? localEnv.BACKEND_API_URL_SLUG ?? '/api';

if (!backendUrl?.trim()) {
  throw new Error(
    'BACKEND_API_URL is required. Set it in the Amplify environment variables or local .env file.',
  );
}

const normalizedUrl = backendUrl.trim().replace(/\/+$/, '');
const normalizedSlug = apiSlug.trim().replace(/^\/+|\/+$/g, '');
const apiUrl = normalizedSlug ? `${normalizedUrl}/${normalizedSlug}` : normalizedUrl;
const generatedSource = `export const apiUrl = ${JSON.stringify(apiUrl)};\n`;

writeFileSync(generatedFilePath, generatedSource);
console.log(`Generated ${generatedFilePath}`);
