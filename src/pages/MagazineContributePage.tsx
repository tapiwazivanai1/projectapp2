import React, { useState } from "react";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Image,
  FileText,
  Video,
  Mic,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MagazineContributePage: React.FC = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState("article");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview URL for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!title.trim()) {
      setError("Please enter a title for your contribution");
      return;
    }

    if (!content.trim() && contentType === "article") {
      setError("Please enter content for your article");
      return;
    }

    if (
      !file &&
      (contentType === "image" ||
        contentType === "video" ||
        contentType === "audio")
    ) {
      setError(`Please upload a ${contentType} file`);
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    // Simulate submission
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/magazine");
      }, 3000);
    }, 2000);
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case "article":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Mic className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />

        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Submission Received!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your contribution to the Guta Ra Mwari Magazine.
              Your submission will be reviewed by our team and published once
              approved.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to magazine page...
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Contribute to Our Magazine
          </h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            {/* Content Type Selection */}
            <div className="space-y-3">
              <Label>Content Type</Label>
              <RadioGroup
                defaultValue="article"
                value={contentType}
                onValueChange={setContentType}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="article" id="article" />
                  <Label
                    htmlFor="article"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" /> Article
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label
                    htmlFor="image"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Image className="h-4 w-4" /> Image
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label
                    htmlFor="video"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="h-4 w-4" /> Video
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="audio" id="audio" />
                  <Label
                    htmlFor="audio"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Mic className="h-4 w-4" /> Audio
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your contribution"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content (for articles) */}
            {contentType === "article" && (
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your article here..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}

            {/* File Upload (for image, video, audio) */}
            {(contentType === "image" ||
              contentType === "video" ||
              contentType === "audio") && (
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload {contentType}</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewUrl && contentType === "image" ? (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[200px] mx-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Drag and drop your {contentType} here, or click to
                        browse
                      </p>
                    </div>
                  )}
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept={
                      contentType === "image"
                        ? "image/*"
                        : contentType === "video"
                          ? "video/*"
                          : "audio/*"
                    }
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className="mt-2"
                  >
                    {file ? "Change File" : "Select File"}
                  </Button>
                  {file && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testimonies">Testimonies</SelectItem>
                  <SelectItem value="teachings">Teachings</SelectItem>
                  <SelectItem value="events">Church Events</SelectItem>
                  <SelectItem value="youth">Youth Corner</SelectItem>
                  <SelectItem value="worship">Worship</SelectItem>
                  <SelectItem value="outreach">Outreach & Missions</SelectItem>
                  <SelectItem value="devotional">Daily Devotional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  {getContentTypeIcon()}
                  <span className="ml-2">Submit for Approval</span>
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your contribution will be reviewed by our team before being
              published in the magazine. Please ensure your content aligns with
              our community guidelines.
            </p>
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MagazineContributePage;
