export default function BlogForm({ title, content, setTitle, setContent, error, onSubmit, submitButtonText }) {
    return (
      <form onSubmit={onSubmit} className="max-w-lg mx-auto">
        {/* Display error message if any */}
        {error && <div className="alert alert-danger mb-4">{error}</div>}
  
        <div className="form-group mb-4">
          <label htmlFor="title" className="block text-lg font-medium text-gray-800">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-slate-50 rounded"
          />
        </div>
  
        <div className="form-group mb-4">
          <label htmlFor="content" className="block text-lg font-medium bg-slate-50 text-gray-800">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full max-w-3xl p-2 h-96 border bg-slate-50 border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-center form-group mb-4">
        <button type="submit" className="btn btn-primary w-full mt-10 text-lg text-white">
          {submitButtonText || "Submit"}
        </button>
        </div>
      </form>
    );
  }
  