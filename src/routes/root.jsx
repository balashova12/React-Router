import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

// Async function for handling the creation of a new contact
export async function action() {
  // Create a new contact and redirect to its edit page
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// Async function for loading contacts based on a search query
export async function loader({ request }) {
  // Extract the search query from the request URL
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  // Get contacts based on the search query
  const contacts = await getContacts(q);
  // Return contacts and the search query as loader data
  return { contacts, q };
}

// Functional component for the root of the application
export default function Root() {
  // Extract loader data using useLoaderData hook
  const { contacts, q } = useLoaderData();
  // Use hooks for navigation and form submission
  const navigation = useNavigation();
  const submit = useSubmit();
  // Check if the application is in a searching state
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  // Effect hook to set the default value of the search input
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  // Render the main structure of the application
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}