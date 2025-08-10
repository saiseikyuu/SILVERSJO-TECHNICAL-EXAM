// index.ts
import app from "./app.js"; // ✅ Use `.js` extension for ESM compatibility

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
