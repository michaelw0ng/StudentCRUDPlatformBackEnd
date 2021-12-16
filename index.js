const express = require("express");
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize("sequelize_db", "m", "", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});
const server = express();

server.listen(8080);

server.get("/", () => {
  console.log("hello");
});

class campuses extends Model {}

campuses.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "campuses",
    timestamps: true,
  }
);

console.log(campuses === sequelize.models.campuses); // true
console.log(sequelize.models);

class students extends Model {}

students.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    gpa: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 0.0,
        max: 4.0,
      },
    },
  },
  {
    sequelize,
    modelName: "students",
    timestamps: true,
  }
);
console.log(students === sequelize.models.students); // true
console.log(sequelize.models);

async function sync() {
  await sequelize.sync();
}

sync();

const addStudent = (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
  });
};

const addCampus = (req, res) => {
  let body;
  req.on("data", function (data) {
    body += data;
    if (body.substr(0, 9) == "undefined") {
      body = body.substr(9, body.length - 9);
    }
  });

  req.on("end", function () {
    body = JSON.parse(body.toString("utf8"));
    console.log(body);
    async function createCampus() {
      const newCampus = await campuses.create(body);
      console.log(newCampus.id);
      res.end("recorded");
    }
    createCampus();
    async function viewCampuses() {
      const viewCampuses = await campuses.findAll();
      console.log(viewCampuses.every((campus) => campus instanceof campuses));
      console.log("All campuses:", JSON.stringify(viewCampuses));
    }
    viewCampuses();
    async function findTables() {
      sequelize
        .getQueryInterface()
        .showAllSchemas()
        .then((tableObj) => {
          console.log("// Tables in database", "==========================");
          console.log(tableObj);
        })
        .catch((err) => {
          console.log("showAllSchemas ERROR", err);
        });
    }
    async function sync() {
      await sequelize.sync();
    }

    sync();
    findTables();
  });
};

server.post("/addstudent", (req, res) => {
  addStudent(req, res);
});

server.post("/addcampus", (req, res) => {
  addCampus(req, res);
});
