const express = require("express");

const app = express();
app.use(express.json())

let courses = [];

app.get("/courses", (request, response) => {
  return response.json(courses);
});

app.post("/courses", (request, response) => {
  const { name } = request.body;
  const newCourse = { id: courses.length, name };
  courses.push(newCourse);
  return response.json(newCourse);
});

// Nesse caso o patch tb é igual
app.put("/courses/:id", (request, response) => {
  const { id } = request.params;
  const { name } = request.body;
  let getCourse = courses.find((course) => course.id === Number(id));
  if (getCourse) {
    const newCourse = { id: getCourse.id, name };
    courses = courses.map((course) => {
      if (course.id === Number(id)) {
        return newCourse;
      }
      return course;
    });
    return response.json(newCourse);
  } else {
    return response.status(404).json({ error: "Not Found" });
  }
});

app.delete("/courses/:id", (request, response) => {
  const { id } = request.params;
  let getCourseIndex = courses.findIndex((course) => course.id === Number(id));
  if (getCourseIndex >= 0) {
    courses.shift(getCourseIndex, 1);
    return response.status(200).json({ ok: true });
  } else {
    return response.status(404).json({ error: "Not Found" });
  }
});

app.listen(3333);
