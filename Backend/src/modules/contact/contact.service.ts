import { Contact } from "./contact.model";
import { CreateContactInput } from "./contact.validation";

export const createContactService = async (
  data: CreateContactInput
) => {
  const contact = await Contact.create({
    name: data.name,
    email: data.email,
    telephone: data.telephone || "",
    subject: data.subject || "",
    message: data.message,
  });

  return contact;
};