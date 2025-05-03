import { db_conn } from "../database.js";

export function newClass(
    id,
    class_datetime,
    location_id,
    activity_id,
    trainer_user_id,
    removed
) {
    return {
        id,
        class_datetime,
        location_id,
        activity_id,
        trainer_user_id,
        removed  
    }
}

// GEt all classes

export function getAll() {
    return db_conn.query("SELECT * FROM classes WHERE class_removed = 0")
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                result => newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_location_id,
                    result.class_activity_id,
                    result.class_trainer_user_id,
                    result.class_removed 
                )
            )

        })
}


// get a classes by location_id, 
export function create(gymClass) {
    return db_conn.query(
        `INSERT INTO classes (class_datetime, class_location_id, class_activity_id, class_trainer_user_id)
        VALUES (?, ?, ?, ?)
        `,
        [
            gymClass.class_datetime, 
            gymClass.location_id,
            gymClass.activity_id,
            gymClass.trainer_user_id
        ]
    )
}

export function getById(classID) {
    return db_conn.query(`SELECT * FROM classes WHERE class_id = ? and class_removed = 0`, [classID])
        .then(([queryResult]) => {
            if (queryResult.length > 0) {
                const result = queryResult[0]

                return newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_location_id,
                    result.class_activity_id,
                    result.class_trainer_user_id,
                    result.class_removed
                )
            } else {
                return Promise.reject("No matching results")
            }
        })
}

export function getByTrainerIdAndDateTime(trainerID, classDateTime) {
    return db_conn.query(
        `SELECT * FROM classes WHERE class_trainer_user_id = ? AND class_datetime = ? AND class_removed = 0`,
        [trainerID, classDateTime]
    ).then(([queryResult]) => {
        if (queryResult.length > 0) {
            const result = queryResult[0];
            return newClass(
                result.class_id,
                result.class_datetime,
                result.class_location_id,
                result.class_activity_id,
                result.class_trainer_user_id,
                result.class_removed
            );
        } else {
            return Promise.reject("Trainer has no class at this date and time.");          
        }
    })
}

export function getByClassNameAndDate(className, classDate) {
    return db_conn.query(
        `SELECT * FROM classes 
         WHERE class_activity_id = (SELECT activity_id FROM activities WHERE activity_name = ?) 
         AND DATE(class_datetime) = ? 
         AND class_removed = 0`,
        [className, classDate]
    ).then(([queryResult]) => {
        if (queryResult.length > 0) {
            // Assuming newClass is a function that formats the result as needed
            return queryResult.map(result => newClass(
                result.class_id,
                result.class_datetime,
                result.class_location_id,
                result.class_activity_id,
                result.class_trainer_user_id,
                result.class_removed
            ));
        } else {
            return Promise.reject("No classes found for the specified name and date.");          
        }
    });
}


export function update(gymClass) {
    return db_conn.query(
        `
        UPDATE classes
        SET class_datetime = ?, class_location_id = ?, class_activity_id = ?, class_trainer_user_id = ?
        WHERE class_id = ?`,
        [gymClass.class_datetime, gymClass.location_id, gymClass.activity_id,  gymClass.trainer_user_id, gymClass.id]
    )
}

// I am going to search by name, either first name or last name
// export function getBySearch(searchTerm)


export function deleteById(classID) {
    return db_conn.query(
        `
        UPDATE classes
        SET class_removed = 1 
        WHERE class_id = ?`,
        [classID]
    )
}

export function getEarliestDate() {
    return db_conn.query(
        `
        SELECT MIN(class_datetime) as earliestDate
        FROM classes WHERE class_removed = 0`
    )
}

export function getLatestDate() {
    return db_conn.query(
        `
        SELECT MAX(class_datetime) as latestDate
        FROM classes WHERE class_removed = 0`
    )
}

// export function getByTrainerLocationDatetimeActivity(trainerId, locationId, classDatetime, activityId) {
//     return db_conn.query(
//         `SELECT * FROM classes 
//          WHERE class_trainer_user_id = ? 
//          AND class_location_id = ? 
//          AND class_datetime = ? 
//          AND class_activity_id = ? 
//          AND class_removed = 0`,
//         [trainerId, locationId, classDatetime, activityId]
//     ).then(([queryResult]) => {
//         if (queryResult.length > 0) {
//             const result = queryResult[0];
//             return newClass(
//                 result.class_id,
//                 result.class_datetime,
//                 result.class_location_id,
//                 result.class_activity_id,
//                 result.class_trainer_user_id,
//                 result.class_removed
//             );
//         } else {
//             return Promise.reject("No class found with the specified criteria.");
//         }
//     });
// }

export function getByTrainerLocationDatetimeActivity(trainerId, locationId, classDatetime, activityId) {
    return db_conn.query(
        `SELECT * FROM classes 
         WHERE class_trainer_user_id = ? 
         AND class_location_id = ? 
         AND class_datetime = ? 
         AND class_activity_id = ? 
         AND class_removed = 0`,
        [trainerId, locationId, classDatetime, activityId]
    ).then(([queryResult]) => {
        // Return true if any classes are found, otherwise return false
        return queryResult.length > 0; // true if found, false if not
    });
}

export function getByTrainerDatetime(trainerId, classDatetime) {
    return db_conn.query(
        `SELECT * FROM classes
        WHERE class_trainer_user_id = ?
        AND class_datetime = ?
        AND class_removed = 0`,
        [trainerId, classDatetime]
        
    ).then(([queryResult]) => {
        return queryResult.length > 0
    })
}