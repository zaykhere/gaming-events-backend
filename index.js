const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    })
  );

//Import Routes
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/events");

//Use those routes
app.use("/api", userRoutes);
app.use("/api", eventRoutes);

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