import { useEffect, useState } from "react";
import * as Blogs from "../../api/blogs";
import BlogCard from "./BlogCard";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../common/PageLayout";

export default function MyBlogsPage() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [user] = useAuthentication();
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const userRole = user?.role || '';

  useEffect(() => {
    const fetchBlogs = async () => {
      if (user && token) {
        try {
          const blogs = await Blogs.getMyBlogs(token);
          setMyBlogs(blogs);
        } catch (error) {
          console.error("Error fetching my blogs: ", error);
        }
      }
    };
    fetchBlogs();
  }, [user, token]);

  const handleEdit = (blogId) => {
    navigate(`/blogs/edit/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      try {
        await Blogs.remove(blogId, token);
        setMyBlogs(myBlogs.filter(blog => blog.id !== blogId));
      } catch (error) {
        console.error("Error deleting blog: ", error);
      }
    }
  };

  const handleCreate = () => {
    navigate('/blogs/create');
  };

  return (
    <PageLayout>
    
      <div className="container p-2 mx-auto">
        <h2 className="text-center text-2xl font-bold ">My Blogs</h2>
        <div className="text-center mb-4">
          <button 
            onClick={handleCreate}
            className="btn btn-primary border-md bg-blue-500 text-lg text-white mt-8"
          >
            Create New Blog
          </button>
        </div>
        <div className="grid gap-4 grid-cols-1">
          {myBlogs.length > 0 ? (
            myBlogs.map((blogPost) => (
              <BlogCard
                key={blogPost.id}
                blogPost={blogPost}
                onEdit={handleEdit}
                onDelete={handleDelete}
                userRole={userRole}
              />
            ))
          ) : (
            <div className="text-center">You have not posted any blogs</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
