
import { openDB } from 'idb';
import { MyDB } from './mydb';

export const dbPromise = openDB<MyDB>('myDatabase', 2, {
    upgrade(db, oldVersion, _newVersion, transaction) {

        // Version 1: Create initial tables
        if (oldVersion < 1) {
            db.createObjectStore('role', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('poll', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('question', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('answer', { keyPath: 'id', autoIncrement: true });
        }

        // Version 2: Add indexes
        if (oldVersion < 2) {
            const userStore = transaction.objectStore('user');
            // Users can share the same role, so this index is not unique
            userStore.createIndex('roleId', 'roleId', { unique: false });

            const pollStore = transaction.objectStore('poll');
            // A user can create multiple polls, so this index is not unique
            pollStore.createIndex('userId', 'userId', { unique: false });

            const questionStore = transaction.objectStore('question');
            // A poll can have multiple questions, so this index is not unique
            questionStore.createIndex('pollId', 'pollId', { unique: false });

            const answerStore = transaction.objectStore('answer');
            // A question can have multiple answers, so this index is not unique
            answerStore.createIndex('questionId', 'questionId', { unique: false });
            // A user can answer multiple questions, so this index is not unique
            answerStore.createIndex('userId', 'userId', { unique: false })
        }
    }
});