import { db_conn } from "../database.js";

// Define the model for trainer profiles
export function newTrainerProfile(
    profile_id,
    user_id,
    description
) {
    return {
        profile_id,
        user_id,
        description
    };
}

// Get all trainer profiles
export function getAll() {
    return db_conn.query("SELECT * FROM trainer_profiles")
        .then(([queryResult]) => {
            // Convert each result into a model object
            return queryResult.map(
                result => newTrainerProfile(
                    result.profile_id,
                    result.user_id,
                    result.description
                )
            );
        });
}

// Get trainer profile by profile_id
export function getById(profileID) {
    return db_conn.query("SELECT * FROM trainer_profiles WHERE profile_id = ?", [profileID])
        .then(([queryResult]) => {
            if (queryResult.length > 0) {
                const result = queryResult[0];
                return newTrainerProfile(
                    result.profile_id,
                    result.user_id,
                    result.description
                );
            } else {
                return Promise.reject("No matching results");
            }
        });
}

// Get trainer profile by user_id
export function getByUserId(userID) {
    return db_conn.query("SELECT * FROM trainer_profiles WHERE user_id = ?", [userID])
        .then(([queryResult]) => {
            if (queryResult.length > 0) {
                const result = queryResult[0];
                return newTrainerProfile(
                    result.profile_id,
                    result.user_id,
                    result.description
                );
            } else {
                return Promise.reject("No matching results");
            }
        });
}

// Create a new trainer profile
export function create(trainerProfile) {
    return db_conn.query(
        `
        INSERT INTO trainer_profiles
        (user_id, description)
        VALUES (?, ?)
    `,
    [   
        trainerProfile.user_id,
        trainerProfile.description
    ]);
}

// Update a trainer profile by profile_id
export function update(trainerProfile) {
    return db_conn.query(
        `
        UPDATE trainer_profiles
        SET description = ?
        WHERE profile_id = ?
    `,
    [   
        trainerProfile.description,
        trainerProfile.profile_id
    ]);
}

// Delete a trainer profile by profile_id (mark as removed)
export function deleteById(profileID) {
    return db_conn.query(
        `
        UPDATE trainer_profiles
        SET removed = 1 
        WHERE profile_id = ?
    `,
    [profileID]);
}
