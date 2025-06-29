import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Save, ArrowRight, Edit, MessageSquare } from "lucide-react";

interface Document {
  _id: string;
  title: string;
  updatedAt: string;
}

const HomePage = () => {
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/documents");
        // Get the 3 most recently updated documents
        const recent = [...response.data]
          .sort((a: Document, b: Document) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3);
        setRecentDocuments(recent);
      } catch (error) {
        console.error("Error fetching recent documents:", error);
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

  const formatDate = (dateString: string) => {
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
              <Button
                onClick={handleCreateDocument}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <FileText className="mr-2 h-5 w-5" />
                Create New Document
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-white/80 backdrop-blur hover:bg-white border-gray-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Link to="/documents">
                  Browse Documents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="bg-white/60 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Real-time Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Work together with your team in real-time. See changes as they happen without refreshing the page.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-white/60 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Edit className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Rich Text Editing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Format your documents with rich text features. Add headings, lists, images, and more.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-white/60 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Save className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Auto-Saving</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Never lose your work again. CoWrite automatically saves your documents as you type.
              </CardDescription>
            </CardContent>
          </Card>
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
                <Card
                  key={doc._id}
                  className="cursor-pointer group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/80 backdrop-blur border-white/50"
                  onClick={() => navigate(`/documents/${doc._id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <CardTitle className="text-base font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {doc.title || "Untitled Document"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm text-gray-500">
                      Last edited: {formatDate(doc.updatedAt)}
                    </CardDescription>
                  </CardContent>
                </Card>
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
            <Button
              onClick={handleCreateDocument}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FileText className="mr-2 h-5 w-5" />
              Create Your First Document
            </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
