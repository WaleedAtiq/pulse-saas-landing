import { ImageResponse } from "next/og";

/*
 * The icon iPhones/iPads use when someone saves the site to their home screen
 * (180×180 PNG, generated at build time). Same mark as app/icon.svg.
 * Hex colors because the image renderer can't read CSS variables: #7756ff is
 * --color-accent.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#7756ff" }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <path d="M5 17h5l3-7 5 13 3-6h6" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
