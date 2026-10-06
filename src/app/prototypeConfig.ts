// OWNER CONFIGURATION ONLY. These URLs are not editable by prototype users.
export const PROTOTYPE_CONFIG = {
  video: {
    // Keep the home video local so browser cross-origin policies don't block playback.
    homeVideoUrl: "/assets/home-video.mp4",
    // Paste the public LANDSCAPE video URL here. It plays when the phone is tilted.
    // Leave empty to reuse homeVideoUrl without restarting playback on rotation.
    landscapeVideoUrl: "",
    // Keep H.264 MP4 files around 720p, 24–30 fps, with audio AAC and fast-start enabled.
    // For reliable demos, place both videos in public/assets and use local URLs.
    posterUrl: "/assets/camera-poster.png",
  },
  // Default schedule for the interactive Schedule Unlock preview.
  schedule: {
    enabled: true,
    hour: 10,
    minute: 15,
    repeat: "CUSTOM" as "NEVER" | "DAILY" | "WEEKDAYS" | "WEEKENDS" | "CUSTOM",
    days: [5, 6],
  },
}

export function resolveVideoUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  try {
    const url = new URL(trimmed)
    if (url.hostname === "drive.google.com") {
      const fileId =
        url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
        url.searchParams.get("id")
      if (fileId)
        return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`
    }
  } catch {
    return trimmed
  }
  return trimmed
}

export function isDriveVideoUrl(value: string) {
  try {
    const url = new URL(value)
    return (
      url.hostname === "drive.google.com" &&
      /^\/file\/d\/[^/]+\/preview$/.test(url.pathname)
    )
  } catch {
    return false
  }
}
