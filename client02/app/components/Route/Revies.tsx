import Image from "next/image";
import React from "react";
import { Style } from "@/app/style/stylelogin";
import ReviewCard from "../Review/ReviewCard";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type Props = {};

const Revies = (props: Props) => {
  const { data, error, isLoading } = useGetAllCoursesQuery(undefined);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu.</div>;
  }

  // Trích xuất reviews từ tất cả các khóa học
  const reviews = data?.courses && Array.isArray(data.courses)
    ? data.courses.flatMap((course: any) => course.reviews || [])
    : [];

  console.log("Dữ liệu reviews:", reviews);

  return (
    <div className="w-[90%] md:w-[85%] m-auto py-16">
      {/* Phần hình ảnh & văn bản */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Hình ảnh */}
        <div className="md:w-1/2 w-full rounded overflow-hidden shadow-lg hover:scale-105 transition-all duration-500">
          <Image
            src={require("../../../public/asstes/business3.jpg")}
            alt="business"
            width={500}
            height={350}
            className="rounded-md object-cover hero_animation"
          />
        </div>

        {/* Phần văn bản */}
        <div className="md:w-1/2 w-full text-center md:text-left mt-8 md:mt-0">
          <h3 className={`${Style.title} text-3xl md:text-4xl font-bold text-black dark:text-white`}>
            Học sinh của chúng tôi có{" "}
            <span className="text-green-300">Sức mạnh của chúng tôi</span> <br />
            Xem Họ Nói Gì Về Chúng Tôi
          </h3>
          <br />
          <p className={`${Style.Label} text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300`}>
            Bản thân công ty đã là một công ty rất thành công. Và vì chúng ta xứng đáng với niềm vui,
            không ai có thể chịu đựng nỗi đau bằng niềm vui.
          </p>
        </div>
      </div>

      <br />
      <br />

      {/* Danh sách review */}
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 
        md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-40px]">
        {reviews.length === 0 ? (
          <div>Chưa có đánh giá nào</div>
        ) : (
          reviews.map((review: any, index: number) => (
            <ReviewCard key={index} item={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default Revies;
