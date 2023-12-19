import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "484823",
  port: 5432,
});
db.connect();

var items = [];
async function getItems(){
  const dbItems = await db.query("SELECT * FROM items ORDER BY id ASC");
  items = dbItems.rows;
  console.log(items);
}

app.get("/", async (req, res) => {
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const updatedItemTitle = req.body.updatedItemTitle;
  const updatedItemId = req.body.updatedItemId;
  await db.query(`UPDATE items SET title = '${updatedItemTitle}' WHERE id = ${updatedItemId} `);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  let itemid = req.body.deleteItemId;
  await db.query(`DELETE FROM items WHERE id = ${itemid} `);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
