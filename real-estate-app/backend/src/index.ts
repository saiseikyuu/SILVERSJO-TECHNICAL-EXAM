import serverless from "serverless-http";
import app from "./app.js"; // ✅ Use `.js` extension for ESM

const isLocal = process.env.LOCAL === "true";

if (isLocal) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running locally on http://localhost:${port}`);
  });
}

export const handler = serverless(app);
