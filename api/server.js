const express = require("express");
const gridGen = require("./utils");
console.log(gridGen)

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/gen", async (req, res) => {
    let {rows, columns, pieces} = req.query;
    rows = parseInt(rows);
    columns = parseInt(columns);
    pieces = parseInt(pieces);
    console.log(rows, columns, pieces)
    const places = await gridGen.cycleGenerator(rows, columns, pieces);
    console.log(places)
    const grid = await gridGen.drawPieces(rows, columns, places);
    cssData = await gridGen.convertToCSS(rows, columns, places);
    res.json({cssData , grid, places});
}
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
