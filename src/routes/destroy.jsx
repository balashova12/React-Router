import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

// Action function to handle deleting a contact
export async function action({ params }) {
  // Attempt to delete the contact using the provided contactId
  await deleteContact(params.contactId);
  // Redirect to the home page after deletion
  return redirect("/");
}