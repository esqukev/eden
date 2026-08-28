import { site } from "@/data/site";
import styles from "./EdenMark.module.css";

type MarkTone = "bone" | "white";

export function EdenMark({
  tone = "bone",
  className,
}: {
  tone?: MarkTone;
  className?: string;
}) {
  return (
    <img
      className={`${styles.mark} ${tone === "white" ? styles.white : styles.bone}${className ? ` ${className}` : ""}`}
      src={site.mark}
      alt={site.name}
      draggable={false}
    />
  );
}
