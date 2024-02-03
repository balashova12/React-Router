import {
  Form,
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";
import { updateContact } from "../contacts";

// Action function to handle form submission and update contact information
export async function action({ request, params }) {
  // Extract form data from the request
  const formData = await request.formData();
  const firstName = formData.get("first");
  const lastName = formData.get("last");
  // Create an object with form data updates
  const updates = Object.fromEntries(formData);
  updates.first; // "Some"
  updates.last; // "Name"
  // Update the contact using the provided contactId
  await updateContact(params.contactId, updates);
  // Redirect to the edited contact page
  return redirect(`/contacts/${params.contactId}`);
}

// Functional component for editing contact details
export default function EditContact() {
  // Load contact data using react-router's useLoaderData
  const { contact } = useLoaderData();
  // Get navigate function to control page navigation
  const navigate = useNavigate();

  return (
    // Render an HTML form for editing contact information
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        > 
          Cancel
        </button>
      </p>
    </Form>
  );
}