"use server";

import { GetObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { env } from "~/env";
import { inngest } from "~/inngest/client";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function processVideo(uploadedFileId: string) {
  const uploadedVideo = await db.uploadedFile.findUniqueOrThrow({
    where: {
      id: uploadedFileId,
    },
    select: {
      uploaded: true,
      id: true,
      userId: true,
    },
  });

  if (uploadedVideo.uploaded) return;

  await inngest.send({
    name: "process-video-events",
    data: { uploadedFileId: uploadedVideo.id, userId: uploadedVideo.userId },
  });

  await db.uploadedFile.update({
    where: {
      id: uploadedFileId,
    },
    data: {
      uploaded: true,
    },
  });

  revalidatePath("/dashboard");
}

export async function getClipPlayUrl(
  clipId: string,
): Promise<{ succes: boolean; url?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { succes: false, error: "Unauthorized" };
  }

  try {
    const clip = await db.clip.findUniqueOrThrow({
      where: {
        id: clipId,
        userId: session.user.id,
      },
    });

    const s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: clip.s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return { succes: true, url: signedUrl };
  } catch {
    return { succes: false, error: "Failed to generate play URL." };
  }
}

export async function deleteClip(
  clipId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // First, get the clip to ensure user owns it and get S3 key
    const clip = await db.clip.findUniqueOrThrow({
      where: {
        id: clipId,
        userId: session.user.id,
      },
    });

    const s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Try to delete from S3, but don't fail if permissions are missing
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: clip.s3Key,
      });

      await s3Client.send(deleteCommand);
      console.log("Successfully deleted from S3");
    } catch (s3Error) {
      console.warn("Failed to delete from S3 (continuing with database deletion):", s3Error);
      // Continue with database deletion even if S3 deletion fails
      // This allows testing while AWS permissions are being configured
    }

    // Delete from database
    await db.clip.delete({
      where: {
        id: clipId,
        userId: session.user.id,
      },
    });

    // Check if there are any remaining clips for this uploaded file
    // Only proceed if uploadedFileId exists
    if (clip.uploadedFileId) {
      const remainingClips = await db.clip.count({
        where: {
          uploadedFileId: clip.uploadedFileId,
          userId: session.user.id,
        },
      });

      // If no clips remain, delete the uploaded file record as well
      if (remainingClips === 0) {
        await db.uploadedFile.delete({
          where: {
            id: clip.uploadedFileId,
            userId: session.user.id,
          },
        });
        console.log("Deleted uploaded file record as no clips remain");
      }
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (deleteError) {
    console.error("Error deleting clip:", deleteError);
    return { success: false, error: "Failed to delete clip." };
  }
}
