
import { openDB } from 'idb';
import { MyDB } from './mydb';

export const dbPromise = openDB<MyDB>('myDatabase', 2, {
    upgrade(db, oldVersion, newVersion) {

        // Version 1: Create initial tables
        if (oldVersion < 1) {
            db.createObjectStore('role', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('poll', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('question', { keyPath:'id', autoIncrement: true });
            db.createObjectStore('answer', { keyPath: 'id', autoIncrement: true });
        }

        // Version 2: Add indexes
        if (oldVersion < 2) {
            const userStore = db.transaction.objectStore('user');
            // Users can share the same role, so this index is not unique
            userStore.createIndex('roleid', 'roleid', { unique: false });

            const pollStore= db.transaction.objectStore('poll');
            // A user can create multiple polls, so this index is not unique
            pollStore.createIndex('userid', 'userid', { unique: false });

            const questionStore = db.transaction.objectStore('question');
            // A poll can have multiple questions, so this index is not unique
            questionStore.createIndex('pollid', 'pollid', { unique: false });

            const answerStore = db.transaction.objectStore('answer');
            // A question can have multiple answers, so this index is not unique
            answerStore.createIndex('questionid', 'questionid', { unique: false });
            // A user can answer multiple questions, so this index is not unique
            answerStore.createIndex('userid', 'userid', { unique : false})
        }
     }
    });