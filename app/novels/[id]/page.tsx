import { NovelViewer } from "./novel-viewer";

export const dynamic = 'force-dynamic';

export default function NovelPage({ params }: { params: { id: string } }) {
  return <NovelViewer id={params.id} />;
}