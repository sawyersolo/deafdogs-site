import crypto from "crypto";

export async function handler(event) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Cloudinary env vars on Netlify." }),
      };
    }

    const folder = event.queryStringParameters?.folder || "deafdogs/gallery";
    const max = Math.min(parseInt(event.queryStringParameters?.max || "60", 10), 100);

    const expression = `folder:${folder} AND resource_type:image`;
    const timestamp = Math.floor(Date.now() / 1000);

    const toSign = `expression=${expression}&max_results=${max}&timestamp=${timestamp}`;
    const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

    const body = {
      expression,
      max_results: max,
      sort_by: [{ uploaded_at: "desc" }],
      timestamp,
      api_key: apiKey,
      signature,
    };

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) return { statusCode: res.status, body: text };

    const data = JSON.parse(text);

    const images = (data.resources || []).map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
    }));

    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
      body: JSON.stringify({ images }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}
