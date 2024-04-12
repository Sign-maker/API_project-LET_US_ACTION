import { Contact } from "../models/Contact.js";

const listContacts = (filter = {}, query = {}) =>
  Contact.find(filter, null, query).populate("owner", "email");

const getContactById = (contactId) => Contact.findById(contactId);

const getOneContact = (filter) =>
  Contact.findOne(filter).populate("owner", "email");

const addContact = (data) => Contact.create(data);

const removeContact = (contactId) => Contact.findByIdAndDelete(contactId);

const removeOneContact = (filter) => Contact.findOneAndDelete(filter);

const updateContact = (contactId, data) =>
  Contact.findByIdAndUpdate(contactId, data);

const updateOneContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export default {
  listContacts,
  getContactById,
  getOneContact,
  removeContact,
  removeOneContact,
  addContact,
  updateContact,
  updateOneContact,
};
