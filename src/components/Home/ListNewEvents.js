import React, { useState, useEffect } from "react";
import styles from "./ListNewEvents.module.css";
import WithLoading from "../_common/WithLoading";
import API_OpenDataParis from "../../utils/API_OpenDataParis";
import CardEvent from "../_common/CardEvent";
export default function ListNewEvents(props) {
    const [listEvent, setlistEvent] = useState();

    useEffect(() => {
        API_OpenDataParis.getListLastEvents()
            .then((events) => setlistEvent(events.map((event) => event.record)))
            .catch(() => setlistEvent(null));
    }, []);

    return (
        <section>
            <h2 className={styles.title}>Actualités</h2>
            <p className={styles.desc}>Les derniers événements publiés :</p>
            <WithLoading
                ifLoading={listEvent === undefined}
                ifEmpty={listEvent?.length === 0}
                componentIfEmpty={<div>Aucun énévement</div>}
                ifError={listEvent === null}
            >
                <div className="displayEvents">
                    {listEvent?.map((event, key) => (
                        <CardEvent key={key} event={event} index={key} />
                    ))}
                </div>
            </WithLoading>
        </section>
    );
}
