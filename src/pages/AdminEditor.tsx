import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const categories = [
  "Politics",
  "IT",
  "Economics",
  "Warfare",
  "Recent War",
  "Stock Market News",
];

const AdminEditor = () => {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePublish = () => {
    // TODO: integrate with Firestore upload
    console.log("publish", { category, title, content, image });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Editor</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
          >
            {mode === "edit" ? "Preview" : "Edit"}
          </Button>
          <Button onClick={handlePublish}>Publish</Button>
        </div>
      </div>

      {mode === "edit" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Feature Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <p className="mt-1 text-sm">{image.name}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Body</label>
            <textarea
              className="w-full h-64 border border-border rounded-md p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">{title || "(No title)"}</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Category: {category}
          </p>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="max-w-full mb-4"
            />
          )}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: content.replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminEditor;
