import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, PlayCircle } from "lucide-react";

export default function Trackcard({ track }) {
  return (
    <Card className="p-4 flex flex-col gap-3">
      <CardHeader>
        <CardTitle>{track.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-400">Learning: {track.language}</p>
        <p className="text-sm text-slate-400">Level: {track.level}</p>
      </CardContent>

      <div className="flex justify-end gap-2">
        <Button className="px-3 py-1.5 flex items-center gap-2">
          <PlayCircle size={18} /> Open
        </Button>

        <Button className="px-3 py-1.5 flex items-center gap-2">
          <Edit size={18} /> Edit
        </Button>
      </div>
    </Card>
  );
}
