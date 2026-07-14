import styles from "./GroupFilter.module.css";

export function GroupFilter({
  groups,
  active,
  onToggle,
}: {
  groups: readonly string[];
  active: Set<string>;
  onToggle: (g: string) => void;
}) {
  return (
    <div className={styles.bar}>
      {groups.map((g) => (
        <button
          key={g}
          className={`${styles.btn} ${active.has(g) ? styles.active : ""}`}
          onClick={() => onToggle(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
