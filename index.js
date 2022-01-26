const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Import Routes
const userRoutes = require("./routes/user");

//Use those routes
app.use("/api", userRoutes);

//Error Handling
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  });

//Server start and config
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));