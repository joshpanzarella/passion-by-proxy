import { tiktok } from "@/data/band";
import { TikTokPlayer } from "@/components/TikTokPlayer";

// The featured TikTok: TikTok's own player (the lightweight /player/v1 page,
// not the embed.js script, which adds its code and tracking to every visit)
// loaded only as the visitor scrolls near it (TikTokPlayer). The buttons open TikTok,
// where likes, follows and views count.
export function TikTokFeature() {
  const { id, heading, caption } = tiktok.featured;
  if (!id) return null;
  const videoUrl = `${tiktok.profile}/video/${id}`;
  const player = `https://www.tiktok.com/player/v1/${id}?music_info=1&description=1&rel=0`;

  return (
    <article className="tiktok">
      <div className="tiktok__frame" data-reveal="">
        <TikTokPlayer src={player} title={`Passion by Proxy on TikTok (@${tiktok.handle})`} />
      </div>
      <div className="tiktok__body" data-reveal="" style={{ "--i": 1 } as React.CSSProperties}>
        <p className="release__kind">@{tiktok.handle}</p>
        <h3 className="tiktok__title offset">{heading}</h3>
        {caption && <p>{caption}</p>}
        <ul className="links">
          <li>
            <a className="button" href={videoUrl} rel="noopener noreferrer" target="_blank">
              watch on TikTok
            </a>
          </li>
          <li>
            <a className="button" href={tiktok.profile} rel="noopener noreferrer" target="_blank">
              follow @{tiktok.handle}
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
