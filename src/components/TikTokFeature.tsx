import { tiktok } from "@/data/band";
import { TikTokPlayer } from "@/components/TikTokPlayer";

// The featured TikTok: TikTok's own player (the lightweight /player/v1 page,
// not the embed.js script, which adds its code and tracking to every visit)
// loaded only as the visitor scrolls near it (TikTokPlayer). The buttons open TikTok,
// where likes, follows and views count.
export function TikTokFeature() {
  const { id, caption } = tiktok.featured;
  if (!id) return null;
  const videoUrl = `${tiktok.profile}/video/${id}`;
  const player = `https://www.tiktok.com/player/v1/${id}?music_info=1&description=1&rel=0`;

  return (
    <figure className="tiktok" data-reveal="">
      <div className="tiktok__frame">
        <TikTokPlayer src={player} title={`Passion by Proxy on TikTok (@${tiktok.handle})`} />
      </div>
      <figcaption className="tiktok__credit">
        <a href={tiktok.profile} rel="noopener noreferrer" target="_blank">
          @{tiktok.handle}
        </a>
        {caption && <> · {caption}</>} ·{" "}
        <a href={videoUrl} rel="noopener noreferrer" target="_blank">
          open in tiktok ↗
        </a>
      </figcaption>
    </figure>
  );
}
