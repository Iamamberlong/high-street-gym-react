import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Blogs from "../../api/blogs";
import { useAuthentication } from "../authentication";
import PageLayout from "../../common/PageLayout";
import BlogForm from "./BlogForm";

export default function EditBlogPage() {
  const { id } = useParams();
  console.log("blogId is ", id)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user] = useAuthentication();
  const token = localStorage.getItem("jwtToken");

  // Fetch the existing blog data to populate the form
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await Blogs.getByIdToEdit(id, token);
        console.log("the blog to be edited is: ", blogData)
        setTitle(blogData.title);
        setContent(blogData.content);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setError("Failed to load blog data for editing.");
      }
    };
      fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { title, content };
      await Blogs.update(id, updatedData, token);
      navigate(`/blogs/my-blogs`); // Redirect to MyBlogsPage after updating
    } catch (error) {
      console.error("Error updating blog:", error);
      setError("An error occurred while updating the blog post.");
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen">
        <div className="container p-4 mx-auto">
          <h2 className="text-center">Edit Blog</h2>
          <BlogForm 
            title={title}
            content={content}
            setTitle={setTitle}
            setContent={setContent}
            error={error}
            onSubmit={handleUpdate}
            submitButtonText="Update Blog"
          />
        </div>
      </div>
    </PageLayout>
  );
}
