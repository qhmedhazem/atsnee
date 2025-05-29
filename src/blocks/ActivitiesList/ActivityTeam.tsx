"use client";

import { FC, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  members: string[];
  memberMode?: boolean;
}

const ActivityTeam: FC<Props> = ({
  name,
  members,
  className,
  memberMode = false,
  ...props
}) => {
  if (memberMode) return <li className="mt-2 font-semibold">{members[0]}</li>;

  return (
    <li className="mt-2">
      <p className="font-semibold">{name}</p>
      <ul className="list-disc list-inside ml-4">
        {members.map((member, memberIdx) => (
          <li key={memberIdx}>{member}</li>
        ))}
      </ul>
    </li>
  );
};

export default ActivityTeam;
