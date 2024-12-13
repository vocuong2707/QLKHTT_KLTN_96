'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import Header from '../Header';
import Footer from '../Footer';
import CourseCard from '../Course/CourseCard';
import { useSearchParams } from 'next/navigation';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSilce';

type Props = {
  setActiveVideo : any,
  data:any
  activeVideo:any,
  isDemo:any
}

const Page = ({
  setActiveVideo:activeVideo,
  data,
  isDemo
}:any) => {
  const searchParams = useSearchParams(); // Sử dụng hook cho CSR
  const search = searchParams?.get('title'); // Lấy từ khóa tìm kiếm từ URL
  const { data: courseData, isLoading: isLoadingCourses } = useGetAllCoursesQuery({});
  const { data: categoriesData } = useGetHeroDataQuery('Categories', {});
  const { data: levelsData } = useGetHeroDataQuery('Levels', {});
  const { data: userData } = useLoadUserQuery({}); // Lấy thông tin người dùng

  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  useEffect(() => {
    if (!courseData?.courses) return;

    // Lọc danh sách khóa học
    let filteredCourses = courseData.courses;

    // Lọc theo các khóa học chưa đăng ký
    if (userData?.user?.courses) {
      const userCourseIds = userData.user.courses.map((course: any) =>
        typeof course === 'object' ? course._id : course
      );
      filteredCourses = filteredCourses.filter((course: any) => !userCourseIds.includes(course._id));
    }

    // Lọc theo từ khóa tìm kiếm
    if (search) {
      filteredCourses = filteredCourses.filter((course: any) =>
        course.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Lọc theo danh mục hoặc cấp độ
    if (category !== 'All') {
      filteredCourses = filteredCourses.filter((course: any) => course.category === category);
    }

    if (level !== 'All') {
      filteredCourses = filteredCourses.filter((course: any) => course.level === level);
    }

    setCourses(filteredCourses);
  }, [courseData, userData, search, category, level]);

  const categories = categoriesData?.layout?.categories || [];
  const levels = levelsData?.layout?.levels || [];

  return (
    <div>
      {isLoadingCourses ? (
        <Loader />
      ) : (
        <>
          <Header route="Login" setRoute={() => {}} open={false} setOpen={() => {}} activeItem={1} />
          <div className="w-[95%] md:w-[85%] m-auto min-h-[70vh]">
            <h1 className="text-center font-Poppins text-[20px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white text-[#000] font-[700] tracking-tight">
              Tất cả các khóa học
            </h1>
            <div className="w-full flex flex-col items-start">
              {/* Bộ lọc danh mục */}
              <div className="w-full flex items-center flex-wrap mb-5">
                <div
                  className={`h-[35px] ${
                    category === 'All' ? 'bg-red-600' : 'bg-blue-600'
                  } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setCategory('All')}
                >
                  Tất Cả
                </div>
                {categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title ? 'bg-red-600' : 'bg-blue-600'
                      } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bộ lọc cấp độ */}
              <div className="w-full flex items-center flex-wrap mb-5">
                <div
                  className={`h-[35px] ${
                    level === 'All' ? 'bg-red-600' : 'bg-blue-600'
                  } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setLevel('All')}
                >
                  Tất Cả Cấp Độ
                </div>
                {levels.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        level === item.levelName ? 'bg-red-600' : 'bg-blue-600'
                      } m-3 px-4 rounded-full flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setLevel(item.levelName)}
                    >
                      {item.levelName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kết quả tìm kiếm */}
            {courses.length === 0 && (
              <p className="text-center text-gray-500">
                {search
                  ? 'Không tìm thấy khóa học nào!!'
                  : 'Không tìm thấy khóa học nào trong danh mục này. Vui lòng thử khóa học khác!'}
              </p>
            )}

            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course: any, index: number) => (
                <CourseCard item={course} key={index} />
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
