/**
 * Avatar utilities
 */

// Curated color palette — professional & friendly for edu context
const AVATAR_COLORS = [
  "4F46E5", // Indigo
  "2563EB", // Blue
  "0891B2", // Cyan
  "059669", // Emerald
  "7C3AED", // Violet
  "DB2777", // Pink
  "DC2626", // Red
  "EA580C", // Orange
  "CA8A04", // Yellow
  "16A34A", // Green
] as const;

function getColorFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface GetAvatarUrlOptions {
  avatarUrl?: string | null;
  name: string;
  seed?: string;
  size?: number;
}

/**
 * Returns a valid avatar URL:
 * - If user has a custom avatar_url, returns it as-is
 * - Otherwise, generates an initials-based avatar via DiceBear API
 *
 * @example
 * const url = getAvatarUrl({ avatarUrl: user.avatar_url, name: "Nguyễn Văn A", seed: user.id });
 * // → "https://api.dicebear.com/9.x/initials/svg?seed=Nguy%E1%BB%85n+V%C4%83n+A&backgroundColor=4F46E5&..."
 */
export function getAvatarUrl({
  avatarUrl,
  name,
  seed,
  size = 128,
}: GetAvatarUrlOptions): string {
  // Return custom avatar if available
  if (avatarUrl) {
    return avatarUrl;
  }

  const bgColor = getColorFromSeed(seed || name);

  const params = new URLSearchParams({
    seed: name,
    backgroundColor: bgColor,
    textColor: "ffffff",
    fontSize: "40",
    fontWeight: "700",
    size: size.toString(),
  });

  return `https://api.dicebear.com/9.x/initials/svg?${params.toString()}`;
}
