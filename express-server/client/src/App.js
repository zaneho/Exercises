import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/courses");
      const jsonData = await response.json();
      setCourses(jsonData);
    })();
  }, []);

  return (
    <div className="App">
      <h2>Course List</h2>

      {courses ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      ) : (
        "List is empty"
      )}
    </div>
  );
}

export default App;
