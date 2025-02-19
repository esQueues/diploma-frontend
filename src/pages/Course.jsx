import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Course = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/courses/${id}`, { withCredentials: true })
            .then((response) => {
                setCourse(response.data);
                setEnrolled(response.data.enrolled);
            })
            .catch((error) => {
                console.error("Error fetching course details:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleEnroll = () => {
        axios
            .post(`http://localhost:8080/api/courses/${id}/enroll`, {}, { withCredentials: true })
            .then(() => {
                setEnrolled(true);
            })
            .catch((error) => {
                console.error("Error enrolling in course:", error);
            });
    };

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!course) return <p className="text-center text-danger fs-5">Course not found.</p>;

    return (
        <div className="container mt-5">
            {/* Course Title Section */}
            <div className="card shadow-lg p-4 mb-4 bg-light border rounded">
                <h1 className="fw-bold text-primary">{course.title}</h1>
                <p className="text-secondary">{course.description}</p>
            </div>

            {/* Teacher Profile Section */}
            <Link to={`/teachers/public/${course.teacher?.id}`} className="text-decoration-none">
                <div className="card shadow-sm p-3 d-flex flex-row align-items-center bg-white border rounded mb-4">
                    <img
                        src={course.teacher?.imageUrl || "https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid"}
                        alt="Teacher"
                        className="rounded-circle me-3 border"
                        style={{ width: "90px", height: "90px", objectFit: "cover" }}
                    />
                    <div>
                        <h5 className="mb-1 text-dark">{course.teacher?.firstname} {course.teacher?.lastname}</h5>
                        <p className="text-muted small">{course.teacher?.bio || "No bio available."}</p>
                    </div>
                </div>
            </Link>

            {/* Enroll Button */}
            {enrolled !== null && !enrolled && (
                <div className="text-center my-4">
                    <button className="btn btn-success btn-lg px-5 py-2 rounded-pill" onClick={handleEnroll}>
                        ✅ Enroll in Course
                    </button>
                </div>
            )}

            {/* Modules Section */}
            <div className="card shadow-sm p-4 mb-4 bg-light border rounded">
                {course.modules.length === 0 ? (
                    <p className="text-center text-muted">No modules available.</p>
                ) : (
                    <div className="accordion" id="courseAccordion">
                        {course.modules.map((module, index) => (
                            <div className="accordion-item bg-light" key={module.id}>
                                <h2 className="accordion-header" id={`heading${index}`}>
                                    <button
                                        className="accordion-button collapsed fw-bold bg-white text-dark"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse${index}`}
                                    >
                                        📚 {module.title}
                                    </button>
                                </h2>
                                <div
                                    id={`collapse${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading${index}`}
                                    data-bs-parent="#courseAccordion"
                                >
                                    <div className="accordion-body">
                                        {/* Lectures */}
                                        {module.lectures.length > 0 && (
                                            <div className="mb-3">
                                                <h5 className="fw-bold text-primary">📖 Lectures</h5>
                                                <ul className="list-group">
                                                    {module.lectures.map((lecture) => (
                                                        <li key={lecture.id} className="list-group-item">
                                                            <Link to={`/lectures/${lecture.id}`} className="text-decoration-none text-dark">
                                                                {lecture.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Quizzes */}
                                        {module.quizzes.length > 0 && (
                                            <div>
                                                <h5 className="fw-bold text-danger">📝 Quizzes</h5>
                                                <ul className="list-group">
                                                    {module.quizzes.map((quiz) => (
                                                        <li key={quiz.id} className="list-group-item">
                                                            <Link to={`/quiz/${quiz.id}/profile`} className="text-decoration-none text-dark">
                                                                {quiz.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* No Lectures & Quizzes */}
                                        {module.lectures.length === 0 && module.quizzes.length === 0 && (
                                            <p className="text-muted">No lectures or quizzes available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Course;
