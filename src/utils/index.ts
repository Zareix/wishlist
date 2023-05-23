import { env } from '@/env.mjs';

const isImageFromS3 = (url: string) =>
  new URL(url).hostname === new URL(env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname;

export { isImageFromS3 };
