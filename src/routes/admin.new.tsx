import { createFileRoute } from "@tanstack/react-router";
import { PostForm } from "@/components/PostForm";

export const Route = createFileRoute("/admin/new")({
  component: () => (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Novo post</h2>
      <PostForm />
    </div>
  ),
});
