import { videos } from "@/data/band";
import { VideoCard } from "@/components/VideoCard";
import { TikTokFeature } from "@/components/TikTokFeature";
import { Section, stagger } from "./Section";

export function Videos() {
  return (
    <Section id="videos" title="videos">
      <div className="videos-row">
        <TikTokFeature />
        <div className="videos">
          {videos.map((v, i) => (
            <div key={v.title} data-reveal="" style={stagger(i)}>
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
