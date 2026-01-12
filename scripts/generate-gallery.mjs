import "dotenv/config";
import fs from "fs";
import path from "path";

async function main() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing CLOUDINARY env vars.");
    process.exitCode = 1;
    return;
  }

  const folder = process.env.CLOUDINARY_GALLERY_FOLDER || "deafdogs/gallery";
  const max = Math.min(parseInt(process.env.CLOUDINARY_GALLERY_MAX || "80", 10), 100);

  const expression = `folder:${folder} AND resource_type:image`;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      expression,
      max_results: max,
      sort_by: [{ uploaded_at: "desc" }],
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Cloudinary search failed:", text);
    process.exitCode = 1;
    return;
  }

  const data = JSON.parse(text);

  const images = (data.resources || []).map((r) => ({
    url: r.secure_url,
    public_id: r.public_id,
    width: r.width,
    height: r.height,
    created_at: r.created_at,
  }));

  const outPath = path.join(process.cwd(), "public", "gallery.json");
  fs.writeFileSync(outPath, JSON.stringify({ images }, null, 2), "utf8");
  console.log(`Wrote ${images.length} images -> public/gallery.json`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
