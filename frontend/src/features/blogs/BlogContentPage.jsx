import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Blogs from "../../api/blogs";
import PageLayout from "../../common/PageLayout";
import { useAuthentication } from "../authentication";

export default function BlogContentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user] = useAuthentication(); // Get user for role-based access
  const token = localStorage.getItem("jwtToken"); // Ensure you have a valid token
  const userRole = user?.role || "";
  const userId = user?.userID || null; // Get user ID

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const fetchedBlog = await Blogs.getById(id);
        setBlog(fetchedBlog);
        setTitle(fetchedBlog.title);
        setContent(fetchedBlog.content);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    try {
      const blogData = { title, content };
      await Blogs.update(id, blogData, token);

      const updatedBlog = await Blogs.getById(id);
      setBlog(updatedBlog);
      setTitle(updatedBlog.title);
      setContent(updatedBlog.content);
      setIsEditing(false);
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        {loading ? (
          <p>Loading...</p>
        ) : blog ? (
          <div className="flex flex-col">
            {isEditing ? (
              // Show edit form if user has the required role
              (userRole === "admin" ||
                ((userRole === "member" || userRole === "trainer") &&
                  userId === blog.user_id)) && (
                <div className="flex flex-col">
                  <label className="block mb-2 text-bold">
                    Title:
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full p-2 border bg-slate-100 border-gray-300 rounded"
                    />
                  </label>
                  <label className="block mb-4">
                    Content:
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="block w-full p-2 h-80 border bg-slate-100 border-gray-300 rounded"
                    />
                  </label>
                  <div className="self-center">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white px-4 py-2 w-40 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-violet-500 text-white px-4 py-2 rounded w-40 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col">
                <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {blog.post_datetime}
                </p>
                <div>{blog.content}</div>

                {(userRole === "admin" ||
                  ((userRole === "member" || userRole === "trainer") &&
                    userId === blog.user_id)) && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 w-40 rounded mt-4 self-center"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Blog not found.</p>
        )}
      </div>
    </PageLayout>
  );
}
