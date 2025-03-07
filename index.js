import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { log } from "console";
let fileUrls = dirname(fileURLToPath(import.meta.url));
let app = express();
let port = 3000;
let userAuthentication = false;
app.use(express.static(fileUrls)); // This is for access server url;
app.use(express.static("views")); // This is for access local file
app.use(bodyParser.urlencoded({ extended: true }));
function checkUserDetails(req, res, next) {
    const userNames = req.body["username"];
    const passwords = req.body["password"];
    if (userNames === "Rikai" && passwords === "rikai@122") {
        userAuthentication = true;
    }
    next();
}
app.use(checkUserDetails);
app.set("view engine", "ejs"); // This is for render ejs template
app.set("views", fileUrls + "/views"); //This is for display the ejs file
let allPosts = []; // Store all post;
app.get("/", (req, res) => {
    res.sendFile(fileUrls + "/index.html");
});

app.post("/check", (req, res) => {
    console.log(req.body);
    if (userAuthentication) {
        res.redirect("/view"); // This is for redirect the ejs file on server to avoid the re-submission.
        userAuthentication = false;
    } else {
        res.sendFile(fileUrls + "/index.html");
    }
});
app.get("/postAdd", (req, res) => {
    res.render("postAdd");
});
app.post("/submit", (req, res) => {
    let postTitles = req.body.posttitle;
    let postDescription = req.body.description;
    let publishedDate = new Date().toLocaleDateString("en-GB");
    console.log(postTitles, postDescription);
    allPosts.push({ postTitles, publishedDate });
    res.redirect("/view"); //This is for redirect the ejs file on server to avoid the re-submission.
});
app.get("/view", (req, res) => {
    res.render("view", { allPosts }); //Display all post on view.ejs template
});
app.get("/postDelete", (req, res) => {
    res.render("view", { allPosts });
})
app.post("/delete", (req, res) => {
    let selectedPostsIds = req.body.selectPosts;
    if (!selectedPostsIds) {
        return res.redirect("/view"); // No selection, no action
    }

    if (Array.isArray(selectedPostsIds) && selectedPostsIds.length === allPosts.length) {
        allPosts = []; // Delete all if everything is selected
    } else {
        // Remove selected posts only
        allPosts = allPosts.filter(post => !selectedPostsIds.includes(post.id));
    }

    res.redirect("/view");
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});