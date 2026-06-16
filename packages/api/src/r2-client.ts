import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  /** Optional override; defaults to the standard Cloudflare R2 endpoint for the account. */
  endpoint?: string;
}

/**
 * Thin wrapper around the S3-compatible Cloudflare R2 API. This is the only
 * module in the codebase that should construct R2 credentials — every
 * caller goes through here so URL signing always flows through one place.
 */
export function createR2Client(config: R2Config) {
  const endpoint = config.endpoint ?? `https://${config.accountId}.r2.cloudflarestorage.com`;

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return {
    /** Short-lived URL the client PUTs the original file to directly. */
    async createUploadUrl(objectKey: string, contentType: string, expiresInSeconds: number) {
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey,
        ContentType: contentType,
      });
      return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
    },

    /** Short-lived URL used for reading, downloading, or fetching a cover. */
    async createDownloadUrl(
      objectKey: string,
      expiresInSeconds: number,
      responseContentDisposition?: string,
    ) {
      const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey,
        ResponseContentDisposition: responseContentDisposition,
      });
      return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
    },

    /** Verifies an uploaded object actually exists and matches expectations. */
    async headObject(objectKey: string) {
      const command = new HeadObjectCommand({ Bucket: config.bucketName, Key: objectKey });
      return client.send(command);
    },

    async deleteObject(objectKey: string) {
      const command = new DeleteObjectCommand({ Bucket: config.bucketName, Key: objectKey });
      return client.send(command);
    },

    async deleteObjects(objectKeys: string[]) {
      await Promise.all(objectKeys.map((key) => this.deleteObject(key)));
    },
  };
}

export type R2Client = ReturnType<typeof createR2Client>;
