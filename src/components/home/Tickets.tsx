import styles from "./Tickets.module.css";

export function Tickets() {
  return (
    <section className={styles.section} id="tiquetes">
      <p className={styles.kicker}>Tiquetes</p>
      <h2>La compra se abre con cada noche.</h2>
      <p className={styles.note}>Aquí va a vivir el checkout. Por ahora, el recinto todavía no vende.</p>
    </section>
  );
}
