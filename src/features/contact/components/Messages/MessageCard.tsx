import React from "react";
import Link from "@/components/ui/Link";

import { Message } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getRelativeTime } from "@/lib/utils";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/Badge";

interface Props {
  message: Message;
  href?: string;
}

const MessageCard: React.FC<Props> = ({ message, href }) => {
  return (
    <Card className="w-full cursor-pointer mx-auto duration-300 transition-all rounded-lg border border-gray-200 hover:shadow-xl  hover:-translate-y-0.5">
      <Link href={href || `/admin/messages/${message.id}`}>
        {/* Card Header */}
        <CardHeader className="px-6 pt-6 pb-0">
          <div className="flex flex-row gap-2">
            <h2 className="text-xl font-semibold line-clamp-1">
              Message (ID: {message.id})
            </h2>
            {message.replied && <Badge className="bg-green-500">Replied</Badge>}
            {!message.replied && (
              <Badge className="bg-red-500">Not Replied</Badge>
            )}
          </div>
          <p className="text-sm font-light">
            {message.email +
              " • " +
              message.phone +
              " • " +
              getRelativeTime(message.createdAt)}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-6 pt-4 pb-4">
          <Markdown className="text-gray-600 line-clamp-3">
            {message.content}
          </Markdown>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MessageCard;
