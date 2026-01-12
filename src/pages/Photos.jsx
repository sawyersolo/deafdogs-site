import React, { useEffect, useMemo, useState } from "react";

const featured = [
  // your existing featured images...
];

function labelFromPublicId(publicId) {
  const name = publicId.split("/").pop() || publicId;
  return name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]/g, " ");
}

export default function Photos() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch("/gallery.json")
      .then((r) => r.json())
      .then((d) => setGallery(d.images || []))
      .catch((e) => {
        console.error("Failed to load /gallery.json", e);
        setGallery([]);
      });
  }, []);

  const photos = useMemo(() => {
    const fromFolder = gallery.map((img) => ({
      url: img.url,
      label: labelFromPublicId(img.public_id),
    }));
    return [...featured, ...fromFolder];
  }, [gallery]);

  return (
    <section className="section">
      <div className="section-heading">Gallery</div>
      <div className="photoWall" style={{ marginTop: '2rem' }}>
        {photos.map((p, i) => (
          <div key={`${p.url}-${i}`} className="surface" style={{ padding: ".4rem" }}>
            <img
              src={p.url}
              alt={p.label}
              loading="lazy"
              style={{ width: "100%", borderRadius: 12, display: "block", objectFit: "cover" }}
            />

          </div>
        ))}
      </div>
    </section>
  );
}
