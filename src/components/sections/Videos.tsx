import { videos } from "@/data/band";
import { VideoCard } from "@/components/VideoCard";
import { Section, stagger } from "./Section";

export function Videos() {
  return (
    <Section id="videos" title="videos">
      <div className="videos">
        {videos.map((v, i) => (
          <div key={v.title} data-reveal="" style={stagger(i)}>
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </Section>
  );
}
