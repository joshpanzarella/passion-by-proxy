import { shows } from "@/data/band";
import { ShowList } from "@/components/ShowList";
import { Section } from "./Section";

export function Shows() {
  return (
    <Section id="shows" title="shows">
      <ShowList shows={shows} />
    </Section>
  );
}
