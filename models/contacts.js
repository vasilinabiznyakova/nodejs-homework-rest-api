const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  const result = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(result);
};

const getContactById = async (id) => {
  const contacts = await listContacts();

  const result = contacts.find((contact) => contact.id === id);
  return result || null;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    name,
    email,
    phone,
    id: nanoid(),
  };
  contacts.push(newContact);
  const result = await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, null, 2)
  );
  return newContact;
};

const updateById = async (id, data) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id === id);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = { ...data, id };
  console.log(contacts[idx]);
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  // console.log(contacts);
  // console.log(idx);
  // console.log(contacts[idx]);
  return contacts[idx];
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
};
