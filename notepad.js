let http = require("http");
var fs = require("fs");
const repl = require("repl");
const { parse } = require("querystring");

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

let thisSite = http.createServer(function (req, res) {
  // Home Page
  if (req.url == "/") {
    if (req.method == "GET") {
      res.write("<html><head></head><body>");
      res.write("<p>Welcome to my Note application</p>");
      res.write("<ol><li><a href='/new'>Add new Note</a>(url = /new)</li>");
      res.write("<li><a href='/update'>Edit Note</a>(url = /edit)</li>");
      res.write(
        "<li><a href='/delete'>Delete Note</a>(url = /delete)</li></ol>"
      );
      res.write("</body></html>");

      res.end();
    } else if (req.method == "POST") {
      res.end("The Post Method is not allowed.");
    }
  }
  // Create new note
  else if (req.url == "/new") {
    if (req.method == "GET") {
      res.write("<html><head></head><body>");
      res.write("<p>You can Update Your notes here.</p>");
      res.write(
        "<p>You can have to supply the below parameters in the body of a POST request.</p>"
      );
      res.write("<ol><li>title (Note Name/title)</li>");
      res.write("<li>category (Note Category)</li>");
      res.write("<li>text (New Content of the note)</li></ol>");
      res.write("</body></html>");

      res.end();
    } else if (req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        body = parse(body);
        category = body.category;
        noteTitle = body.title;
        content = body.text;
      });
      req.on("end", () => {
        if (fs.existsSync(category)) {
          fs.writeFile(`${category}/${noteTitle}.txt`, content, function (err) {
            if (err) throw err;
            res.end(`File ${noteTitle} Created Successfully`);
          });
        } else {
          fs.mkdir(category, { recursive: true }, function (err) {
            if (err) {
              res.end(error);
            } else {
              fs.writeFile(`${category}/${noteTitle}.txt`, content, function (
                err
              ) {
                if (err) throw err;
                res.end(
                  `New directory ${category} successfully created and file ${noteTitle} added sucessfully `
                );
              });
            }
          });
        }
      });
    }
  }

  // Delete Existing Note
  else if (req.url == "/delete") {
    if (req.method == "GET") {
      res.write("<html><head></head><body>");
      res.write("<p>You can Update Your notes here.</p>");
      res.write(
        "<p>You can have to supply the below parameters in the body of a POST request.</p>"
      );
      res.write("<ol><li>title (Note Name/title)</li>");
      res.write("<li>category (Note Category)</li>");
      res.write("</body></html>");

      res.end();
    } else if (req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        body = parse(body);
        category = body.category;
        noteTitle = body.title;
      });
      req.on("end", () => {
        fs.unlink(`${category}/${noteTitle}.txt`, function (err) {
          if (err) throw err;
          res.end(`The File ${noteTitle} successfully deleted`);
        });
      });
    }
  }

  // Update Exiting Note
  else if (req.url == "/update") {
    if (req.method == "GET") {
      res.write("<html><head></head><body>");
      res.write("<p>You can Update Your notes here.</p>");
      res.write(
        "<p>You can have to supply the below parameters in the body of a POST request.</p>"
      );
      res.write("<ol><li>title (Note Name/title)</li>");
      res.write("<li>category (Note Category)</li>");
      res.write("<li>text (New Content of the note)</li></ol>");
      res.write("</body></html>");

      res.end();
    } else if (req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        body = parse(body);
        category = body.category;
        noteTitle = body.title;
        content = body.text;
      });
      req.on("end", () => {
        fs.stat(`${category}/${noteTitle}.txt`, function (err, stat) {
          if (err == null) {
            fs.appendFile(`${category}/${noteTitle}.txt`, content, function (
              err
            ) {
              if (err) throw err;
              res.end(`The File ${noteTitle} successfully updated`);
            });
          } else if (err.code === "ENOENT") {
            res.end(`The File ${noteTitle} does not exist`);
          }
        });
      });
    }
  }
});
thisSite.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
