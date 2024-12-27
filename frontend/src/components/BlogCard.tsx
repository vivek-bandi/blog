import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
}
export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="border-b border-slate-200 pb-4 p-4 w-screen max-w-screen-lg cursor-pointer">
        <div className="flex">
          <Avatar name={authorName} />
          <div className="font-extralight pl-2 text-sm flex justify-center flex-col ">
            {authorName}
          </div>
          <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col ">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-bold pt-2">{title}</div>
        <div className="text-md font-thin">{content.slice(0, 100) + "..."}</div>
        <div className="text-slate-500 font-thin pt-4">{`${Math.ceil(
          content.length / 100
        )} min read`}</div>
      </div>
    </Link>
  );
};

export function Avatar({ name }: { name: string }) {
  return (
    <div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden rounded-full dark:bg-gray-600">
      <span className="font-xs text-gray-600 dark:text-gray-300">
        {name[0]}
      </span>
    </div>
  );
}
