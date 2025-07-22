"use client";

import { UserActivity } from "@/types";
import { formatDate } from "@/lib/utils";
import { FiUpload, FiDownload, FiEye, FiShare2, FiBookmark, FiTrash2 } from "react-icons/fi";

interface AccountActivityListProps {
  activities: UserActivity[];
}

export default function AccountActivityList({ activities }: AccountActivityListProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">Chưa có hoạt động nào</p>
      </div>
    );
  }

  // Hàm lấy icon phù hợp với loại hoạt động
  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'upload':
        return <FiUpload className="h-4 w-4 text-blue-400" />;
      case 'download':
        return <FiDownload className="h-4 w-4 text-green-400" />;
      case 'view':
        return <FiEye className="h-4 w-4 text-yellow-400" />;
      case 'share':
        return <FiShare2 className="h-4 w-4 text-purple-400" />;
      case 'save':
        return <FiBookmark className="h-4 w-4 text-pink-400" />;
      case 'delete':
        return <FiTrash2 className="h-4 w-4 text-red-400" />;
      default:
        return <FiEye className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="p-2 rounded-full bg-white/10">
            {getActivityIcon(activity.activityType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/90 mb-1">{activity.description}</p>
            <p className="text-xs text-white/60">{formatDate(new Date(activity.createdat))}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
