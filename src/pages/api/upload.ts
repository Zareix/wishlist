import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import { readFile } from 'fs/promises';
import { type NextApiRequest, type NextApiResponse } from 'next';
import sharp from 'sharp';

import { env } from '@/env.mjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

const formidableParseAsync = async (
  req: NextApiRequest,
): Promise<[formidable.Fields, formidable.Files]> =>
  new Promise((resolve, reject) =>
    formidable().parse(req, (err, fields, files) =>
      err ? reject(err) : resolve([fields, files]),
    ),
  );

const compressImage = async (filePath: string): Promise<Buffer> =>
  sharp(await readFile(filePath))
    .webp()
    .toBuffer();

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [, files] = await formidableParseAsync(req);

    if (!files || !files.file) {
      res.statusMessage = 'Bad Request';
      return res.status(400).send('Bad Request');
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      res.statusMessage = 'Bad Request';
      return res.status(400).send('Bad Request');
    }

    if (file.size > 1024 * 1024 * 5) {
      res.statusMessage = 'File too large';
      return res.status(400).send('File too large');
    }

    if (
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/svg+xml'
    ) {
      res.statusMessage = 'File must be a PNG, JPEG/JPG or SVG';
      return res.status(400).send('File must be a PNG, JPEG/JPG or SVG');
    }

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: file.newFilename + '.webp',
      Body: await compressImage(file.filepath),
      ContentType: `image/webp`,
    });

    try {
      await S3.send(command);
      res.status(200).send({
        url: `${env.S3_PUBLIC_URL}/${file.newFilename}.webp`,
      });
    } catch (error) {
      res.statusMessage = 'Internal Server Error';
      res.status(500).send('Internal Server Error');
    }
  } catch (_err) {
    res.statusMessage = 'Internal Server Error';
    res.status(500).send('Internal Server Error');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST':
      await post(req, res);
      break;
    default:
      res.statusMessage = 'Method not allowed';
      res.status(405).send('Method not allowed');
      break;
  }
}
