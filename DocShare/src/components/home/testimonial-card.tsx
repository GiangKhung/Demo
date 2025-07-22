import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface TestimonialCardProps {
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
}

export default function TestimonialCard({ content, author, rating }: TestimonialCardProps) {
  return (
    <Card className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 transition-all duration-300 h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-blue-900/5 rounded-xl overflow-hidden">
      <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6 md:px-8 flex-grow">
        <div className="flex mb-4 sm:mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarFilledIcon
              key={i}
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                i < rating ? "text-yellow-500" : "text-zinc-600"
              }`}
            />
          ))}
        </div>
        <p className="text-zinc-300 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">{content}</p>
      </CardContent>
      <CardFooter className="border-t border-zinc-800 pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 md:px-8 bg-zinc-900/50">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-blue-500/20">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-medium">
              {author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white text-base sm:text-lg">{author.name}</p>
            <p className="text-zinc-400 text-sm sm:text-base">{author.role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
