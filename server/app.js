import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { buildTagCache } from "./controllers/articleController.js";
import cron from "node-cron"
import geminiRoutes from "./routes/geminiRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import pubRoutes from "./routes/pubRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import { error } from "console";




dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// routes
app.use("/api/articles", articleRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/pubs", pubRoutes);

//
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running in development mode...");
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);


  cron.schedule("0 2 * * *", async () => {
  
  console.log("Rebuilding cache of tags");
  try{

    await buildTagCache();
    console.log("Success.");
  }
  catch (err) {
    console.error("Error: ", err );
  }
  });

  const cachePath = path.join(process.cwd(), "../../resources/cache", "tags.json"
);

if(!fs.existsSync(cachePath)){
  console.log("No cache found - buidling cache");
  buildTagCache().
  then (()=> console.log("Success.")).catch(()=> console.log("Error: ", error));
}
else{
  console.log("Cache found, skipping!")
}

});

