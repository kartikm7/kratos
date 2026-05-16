import { TextAttributes } from "@opentui/core";

export default function App() {
  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box justifyContent="center" alignItems="center" gap={0.5}>
        <ascii-font font="block" color="orange" text="Kratos" />
        <text attributes={TextAttributes.DIM}>Assisted not replacing.</text>
      </box>
    </box>
  )
}

