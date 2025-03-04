/**
 * This test addresses an issue where someone on the discord had their default
 * content type set, but on  browser requests the response  was "null". This is
 * because originally, the response class didn't fully take into account the
 * config AND the accept headers.  Essentially meaning, returning text/html (as
 * this was the first type on the request)
 */

import { assertEquals, TestHelpers } from "../deps.ts";
import { Request, Resource, Response, Server } from "../../mod.ts";

////////////////////////////////////////////////////////////////////////////////
// FILE MARKER - APP SETUP /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class BrowserRequestResource extends Resource {
  paths = ["/browser-request"];

  public GET(_request: Request, response: Response) {
    response.text("hello");
  }
}

const server = new Server({
  resources: [
    BrowserRequestResource,
  ],
  protocol: "https",
  hostname: "localhost",
  port: 3000,
  key_file: "./tests/data/server.key",
  cert_file: "./tests/data/server.crt",
});

////////////////////////////////////////////////////////////////////////////////
// FILE MARKER - TESTS /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Deno.test("browser_request_resource.ts", async (t) => {
  await t.step("GET (https) /browser-request", async (t) => {
    await t.step("Response should be JSON", async () => {
      server.run();
      // Example browser request
      const response = await TestHelpers.makeRequest.get(
        "https://localhost:3000/browser-request",
        {
          headers: {
            Accept: "*/*",
          },
        },
      );
      await server.close();
      assertEquals(await response.text(), "hello");
      assertEquals(
        response.headers.get("Content-Type"),
        "text/plain",
      );
    });
  });
});
