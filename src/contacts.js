import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

// Function to get contacts with optional query for search
export async function getContacts(query) {
  // Simulate network delay
  await fakeNetwork(`getContacts:${query}`);
  // Retrieve contacts from local storage
  let contacts = await localforage.getItem("contacts");
  // If no contacts, initialize as an empty array
  if (!contacts) contacts = [];
  // Apply matching and sorting based on query
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  // Sort contacts by last name and creation date
  return contacts.sort(sortBy("last", "createdAt"));
}

// Function to create a new contact
export async function createContact() {
  // Simulate network delay
  await fakeNetwork();
  // Generate a random ID for the new contact
  let id = Math.random().toString(36).substring(2, 9);
  // Create contact object with ID and creation date
  let contact = { id, createdAt: Date.now() };
  // Retrieve existing contacts
  let contacts = await getContacts();
  // Add the new contact to the beginning of the list
  contacts.unshift(contact);
  // Update contacts in local storage
  await set(contacts);
  // Return the created contact
  return contact;
}

// Function to get contact details by ID
export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  // Find the contact with the specified ID
  let contact = contacts.find(contact => contact.id === id);
  // Return the contact or null if not found
  return contact ?? null;
}

// Function to update contact details by ID
export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  // Throw an error if contact not found
  if (!contact) throw new Error("No contact found for", id);
  // Update contact with new details
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

// Function to delete a contact by ID
export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  // If contact found, remove it and update contacts in local storage
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

// Function to set contacts in local storage
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  // Reset the fake cache if key is not provided
  if (!key) {
    fakeCache = {};
  }

  // If key is in the fake cache, return immediately
  if (fakeCache[key]) {
    return;
  }

  // Add key to fake cache and introduce random delay
  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}