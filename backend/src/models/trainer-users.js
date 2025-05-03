import { db_conn } from "../database.js";

export function newTrainerUser(
    id,
    firstname,
    lastname,
    user_id,
    description,
    photo_url
) {
    return {
    id,
    firstname,
    lastname,
    user_id,
    description,
    photo_url
    }
}

export function getAll() {
    return db_conn.query(
        `
        SELECT t.profile_id, u.user_firstname, u.user_lastname,t.user_id, t.description, t.photo_url
        FROM trainer_profiles t
        INNER JOIN users u 
        ON t.user_id = u.user_id
        `
    )
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                result => newTrainerUser(
                    result.profile_id,
                    result.user_firstname,
                    result.user_lastname,
                    result.user_id,
                    result.description,
                    result.photo_url
                )
            )

        })
}

