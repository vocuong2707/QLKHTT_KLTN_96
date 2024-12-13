import React from "react";
import Image from "next/image";
import Ratings from "@/app/Utils/Ratings";
import Avatar02 from "../../../public/asstes/avatar.png";

type Props = {
  item: {
    user: {
      name: string;
      avatar?: {
        url: string;
      }; // Avatar có thể là đối tượng hoặc không tồn tại
      level?: string; // Thêm trường profession nếu cần thiết
    };
    rating: number;
    comment: string;
    commentReplies?: Array<{
      user: { name: string; avatar?: { url: string }; role: string };
      comment: string;
      createdAt: string;
    }>;
    createdAt: string;
  };
};

const ReviewCard = (props: Props) => {
  const { user, rating, comment, createdAt, commentReplies } = props.item;

  return (
    <div  className="w-full h-max pb-4 dark:bg-slate-500 dark:bg-opacity-[0.25] border
    border-[#00000028] dark:border-[#ffffff1d] backdrop-blur shadow-[bg-slate-700] rounded-lg p-3 shadow-inner">
      {/* Header - Thông tin người dùng */}
      <div className="flex items-center space-x-4">
        <Image
          src={user?.avatar?.url || Avatar02}
          alt="User Avatar"
          width={60}
          height={60}
           className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="800px:flex justify-between w-full">
          <h5 className="text-lg font-bold text-gray-900 dark:text-white">
            {user.name}
          </h5>
          {user.level && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {user.level}
            </p>
          )}
        </div>
        <Ratings rating={rating} />
      </div>

      {/* Nội dung bình luận */}
      <div className="mt-4">
        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          {comment}
        </p>
        <small className="block mt-2 text-sm text-gray-400">
          {new Date(createdAt).toLocaleDateString()}
        </small>
      </div>

      {/* Danh sách trả lời */}
      {commentReplies && commentReplies.length > 0 && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
          <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Replies:
          </h6>
          <div className="space-y-4">
            {commentReplies.map((reply, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Image
                  src={reply.user.avatar?.url || Avatar02}
                  alt="Reply User Avatar"
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <div className="flex-1">
                  <h6 className="text-md font-medium text-gray-800 dark:text-white">
                    {reply.user.name}
                  </h6>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {reply.comment}
                  </p>
                  <small className="text-sm text-gray-400">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
