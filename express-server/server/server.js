const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
];

function validateCourse(course) {
  const schema = Joi.object({ name: Joi.string().min(4).required() });
  return schema.validate(course);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//get all course
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//create new course
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//get single course, pass id as params
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

//update a course
app.put("/api/courses/:id", (req, res) => {
  //1. Look up the course, If not exist, return 404 resource not found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //2. Validate, If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //3. Update course, Return the updated course
  course.name = req.body.name;
  res.send(course);
});

//delete a course
app.delete("/api/courses/:id", (req, res) => {
  //1. Look up the course, If not exist, return 404 resource not found
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //2. Delete, Return the same course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
