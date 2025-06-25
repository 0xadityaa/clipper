import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { processVideo } from "~/inngest/functions";

// Create an API that serves the video processing function
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processVideo],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
