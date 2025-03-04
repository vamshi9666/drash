import { assertEquals } from "../deps.ts";
import { Request, Resource, Response, Server } from "../../mod.ts";

////////////////////////////////////////////////////////////////////////////////
// FILE MARKER - APP SETUP /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class FilesResource extends Resource {
  paths = ["/files"];

  public POST(request: Request, response: Response) {
    response.text(request.bodyParam("value_1") ?? "No body param was set.");
  }
}

const server = new Server({
  resources: [
    FilesResource,
  ],
  protocol: "http",
  hostname: "localhost",
  port: 3000,
});

////////////////////////////////////////////////////////////////////////////////
// FILE MARKER - TESTS /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Deno.test("files_resource_test.ts", async (t) => {
  await t.step("/files", async (t) => {
    await t.step("multipart/form-data works", async () => {
      server.run();

      const formData = new FormData();
      formData.append("value_1", "John");

      const response = await fetch("http://localhost:3000/files", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "text/plain",
        },
      });
      assertEquals(await response.text(), "John");

      await server.close();
    });
  });
});
