//! Default Compute@Edge template program.
import welcomePage from "./welcome-to-compute@edge.html";
import markdownData from "./DESIGN.md";
import MarkdownIt from 'markdown-it';

function render() {
    let md = MarkdownIt();
    let temporary = new Uint8Array(4*1024*1024);
    return md.render(markdownData);
}

const pre_rendered = render();

// The entry point for your application.
//
// Use this fetch event listener to define your main request handling logic. It could be
// used to route based on the request properties (such as method or path), send
// the request to a backend, make completely new requests, and/or generate
// synthetic responses.

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  // Get the client request.
  let req = event.request;

  // Filter requests that have unexpected methods.
  if (!["HEAD", "GET"].includes(req.method)) {
    return new Response("This method is not allowed", {
      status: 405,
    });
  }

  let url = new URL(req.url);

  // If request is to the `/` path...
  if (url.pathname == "/") {
    let htmlData = render();

    // Send a default synthetic response.
    return new Response(htmlData, {
      status: 200,
      headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
    });
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}
