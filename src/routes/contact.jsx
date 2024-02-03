import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// Loader function to fetch contact details based on contactId
export async function loader({ params }) {
  // Fetch contact details
  const contact = await getContact(params.contactId);
  // If the contact is not found, throw a 404 error
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  // Return the contact details
  return { contact };
}

// Action function to handle updating contact favorite status
export async function action({ request, params }) {
  // Get form data from the request
  let formData = await request.formData();
  // Update the contact's favorite status based on the form data
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

// Contact component displaying contact details
export default function Contact() {
  // Load contact data from the loader
  const { contact } = useLoaderData();
  
  // Render the contact details
  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Favorite component to handle marking contacts as favorites
function Favorite({ contact }) {
  // Use fetcher and formData from react-router-dom
  const fetcher = useFetcher();
  // Determine the current favorite status
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  
  // Render the favorite button within a fetcher Form
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}