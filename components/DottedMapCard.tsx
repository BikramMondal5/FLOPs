import * as React from "react"
import { DottedMap } from "@/components/ui/dotted-map"
import type { Marker } from "@/components/ui/dotted-map"

type CountryCode = string

type MyMarker = Marker & {
  overlay: {
    countryCode: CountryCode
    label: string
  }
}

const markers: MyMarker[] = [
  {
    lat: 37.5665,
    lng: 126.978,
    size: 2.8,
    overlay: { countryCode: "kr", label: "Seoul" },
  },
  {
    lat: 40.7128,
    lng: -74.006,
    size: 2.8,
    overlay: { countryCode: "us", label: "NYC" },
  },
  {
    lat: 20.5937,
    lng: 78.9629,
    size: 2.8,
    overlay: { countryCode: "in", label: "India" },
  },
]

export function DottedMapCard() {
  const id = React.useId()
  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent flex items-center justify-center">
      <DottedMap<MyMarker>
        markers={markers}
        dotColor="rgba(226, 157, 170, 0.45)"
        dotRadius={0.28}
        markerColor="#E29DAA"
        pulse={true}
        renderMarkerOverlay={({ marker, x, y, r, index }) => {
          const { countryCode, label } = marker.overlay
          const href = `https://flagcdn.com/w80/${countryCode}.webp`

          const clipId = `${id}-flag-clip-${index}`.replace(/:/g, "-")
          const imgR = r * 0.75

          const fontSize = r * 0.9
          const pillH = r * 1.5
          const pillW = label.length * (fontSize * 0.62) + r * 1.4
          const pillX = x + r + r * 0.6
          const pillY = y - pillH / 2

          return (
            <g style={{ pointerEvents: "none" }}>
              <clipPath id={clipId}>
                <circle cx={x} cy={y} r={imgR} />
              </clipPath>

              <image
                href={href}
                x={x - imgR}
                y={y - imgR}
                width={imgR * 2}
                height={imgR * 2}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
              />

              <rect
                x={pillX}
                y={pillY}
                width={pillW}
                height={pillH}
                rx={pillH / 2}
                fill="rgba(20,24,27,0.75)"
              />
              <text
                x={pillX + r * 0.7}
                y={y + fontSize * 0.35}
                fontSize={fontSize}
                fill="white"
                fontWeight="500"
              >
                {label}
              </text>
            </g>
          )
        }}
      />
    </div>
  )
}
