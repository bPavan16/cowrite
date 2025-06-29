import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/api/documents");
        // Get the 3 most recently updated documents
        const recent = [...response.data]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3);
        setRecentDocuments(recent);
      } catch (error) {
        console.error("Error fetching recent documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDocuments();
  }, []);

  const handleCreateDocument = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/documents", {
        title: `Untitled Document - ${Math.floor(Math.random() * 900 + 100)}`,
      });
      navigate(`/documents/${response.data._id}`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Collaborate
              </span>{" "}
              on documents in real-time
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              CoWrite makes it easy to create, edit, and share documents with
              your team. Work together in real-time, from anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCreateDocument}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create New Document
              </button>
              <Link
                to="/documents"
                className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Documents
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-w-16 aspect-h-9">
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-56 transform">
          <div className="w-96 h-96 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-20 transform">
          <div className="w-72 h-72 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Everything you need for seamless collaboration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Real-time Collaboration
            </h3>
            <p className="text-gray-600">
              Work together with your team in real-time. See changes as they
              happen without refreshing the page.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Rich Text Editing
            </h3>
            <p className="text-gray-600">
              Format your documents with rich text features. Add headings,
              lists, images, and more.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Auto-Saving
            </h3>
            <p className="text-gray-600">
              Never lose your work again. CoWrite automatically saves your
              documents as you type.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Documents Section */}
      {recentDocuments.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Recent Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentDocuments.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/documents/${doc._id}`)}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 truncate">
                      {doc.title || "Untitled Document"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-14">
                    Last edited: {formatDate(doc.updatedAt)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/documents"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                View all documents
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who use CoWrite to collaborate on documents.
          </p>
          <button
            onClick={handleCreateDocument}
            className="px-8 py-4 bg-white text-blue-600 font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Your First Document
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
