import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./CardEvent.module.css";
import { motion } from "framer-motion";
import FavoritesContext from "../../utils/FavoritesContext";
import FavoriteButton from "./FavoriteButton";

export default function CardEvent({ index, event }) {
    const { favoritesEvents, updateFavoritesEvents } =
        React.useContext(FavoritesContext);

    const history = useHistory();
    const maxLengthDescription = 200;

    //////  Pour éviter le dangerouslySetInnerHTML et les problèmes de sécurité ( # Le cours de mardi 13/07 )
    const descConvert = document.createElement("div");
    descConvert.innerHTML = event.fields.description;
    const description =
        descConvert.textContent.length > maxLengthDescription
            ? descConvert.textContent.slice(0, maxLengthDescription) + "..."
            : descConvert.textContent;

    /// animation de fade
    const fadeAnimation = {
        visible: {
            opacity: 1,
            transition: {
                delay: index * 0.2,
            },
        },
        hidden: { opacity: 0 },
    };

    // Pour filtrer les dates à venir  et pas tout les événements
    let listDates = event.fields.date_description
        .split("<br />")
        .join(" ")
        .split("Le")
        .join("###Le")
        .split("###");
    listDates.shift();

    const keysToDelete = event.fields.occurrences
        .split(";")
        .map((el, key) => {
            if (new Date(el.split("_")[0]).getTime() < new Date().getTime())
                return key;
            else return null;
        })
        .filter((e) => e !== null);

    listDates = listDates.filter(
        (el, key) => keysToDelete.findIndex((e) => e === key) === -1
    );

    const handleFavorite = () => {
        if (favoritesEvents.indexOf(event.id) > -1) {
            updateFavoritesEvents(
                favoritesEvents.filter((fav) => fav !== event.id)
            );
        } else {
            updateFavoritesEvents([...favoritesEvents, event.id]);
        }
    };

    const goToArticle = (e) => {
        if (e.target.closest(".fav") === null) {
            history.push(`/event/${event.id}`);
        }
    };

    return (
        <motion.article
            transition={{ duration: 0.2 }}
            initial="hidden"
            animate="visible"
            variants={fadeAnimation}
            className={styles.cardContainer}
            onClick={goToArticle}
        >
            <div
                className={styles.buttonFavorite + " fav"}
                onClick={handleFavorite}
            >
                <FavoriteButton
                    toggle={favoritesEvents.indexOf(event.id) > -1}
                />
            </div>
            <img
                className={styles.cardImage}
                src={event.fields.cover_url}
                alt={event.fields.cover_alt}
            />
            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{event.fields.title}</h3>
                <div className={styles.tooltip}>
                    Dates à venir ᐃ
                    <span className={styles.tooltiptext}>
                        {listDates.map((date, key) => (
                            <li key={key} className={styles.dateText}>
                                {date}
                            </li>
                        ))}
                    </span>
                </div>
                <p className={styles.cardDescription}>{description}</p>
            </div>
        </motion.article>
    );
}
