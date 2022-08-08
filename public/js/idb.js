// create variable to hold database
let db;

// establish a connection to IndexedDB.open('budget_tracker', 1);
const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2)
request.onupgradeneeded = function (event) {
    // save reference to the database
    const db = event.target.result;
    // create an object store (table) called 'budget_tracker', set it to have an auto incrementing primary key
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradeneeded event above) or simply established a connection, save reference to db in global variable
    const db = event.target.result;

    // check if app is online, if yes run uploadBudget() function to send all local db data to api
    if (navigator.onLine) {
        uploadTransaction()
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new budget and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    // access the object store for 'budget_tracker'
    const budgetObjectStore = transaction.objectStore('new_transaction');
    // add record to your store with add method
    budgetObjectStore.add(record);
};