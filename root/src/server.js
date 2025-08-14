import app from "./app.js";
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "127.0.1.1", () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;
