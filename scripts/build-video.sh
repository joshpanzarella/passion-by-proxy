#!/bin/sh
# Builds the hero's U&I video from the original export.
#
#   sh scripts/build-video.sh path/to/U.I.moving_layered.mp4
#
# Needs ffmpeg (brew install ffmpeg). The original (200 MB) stays out of the
# repo; it lives on the passion-by-proxy repo's "media" release.
#
# - crops to the letters (measured with ffmpeg cropdetect over the whole clip,
#   plus a margin), so the page's black shows around them, not the video's
# - makes the loop seamless: the clip's last 0.6 s fades into its start
# - two sizes: phones get the small one (<source media> in HeroSingle.tsx)
# - MP4 (H.264) for Safari and Chrome, plus WebM (VP9) for browsers that
#   ship without H.264 (some Linux builds); the page offers MP4 first
# - no audio track; the clip has none
set -e
SRC="$1"
FFMPEG="${FFMPEG:-ffmpeg}"
OUT="$(dirname "$0")/../public/media"
[ -f "$SRC" ] || { echo "usage: sh scripts/build-video.sh <U&I video.mp4>"; exit 1; }

CROP="crop=2876:1248:282:490"
FADE=0.6
LEN=$("$FFMPEG" -i "$SRC" 2>&1 | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
OFFSET=$(awk "BEGIN{print $LEN - 2*$FADE}")
LOOP="[0:v]$CROP,split[a][b];[a]trim=start=$FADE,setpts=PTS-STARTPTS,fps=30[body];[b]trim=0:$FADE,setpts=PTS-STARTPTS,fps=30[head];[body][head]xfade=transition=fade:duration=$FADE:offset=$OFFSET"

for W in 1200 640; do
  "$FFMPEG" -hide_banner -loglevel error -y -i "$SRC" \
    -filter_complex "$LOOP,scale=$W:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf 30 -profile:v high -movflags +faststart -an \
    "$OUT/u-and-i-$W.mp4"
  "$FFMPEG" -hide_banner -loglevel error -y -i "$SRC" \
    -filter_complex "$LOOP,scale=$W:-2:flags=lanczos,format=yuv420p" \
    -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -an \
    "$OUT/u-and-i-$W.webm"
done
# poster: the loop's first frame, shown until the video plays (and for
# visitors with reduced motion, instead of it)
"$FFMPEG" -hide_banner -loglevel error -y -i "$OUT/u-and-i-1200.mp4" -frames:v 1 -c:v libwebp -quality 80 "$OUT/u-and-i-poster.webp"
ls -la "$OUT"/u-and-i-*
