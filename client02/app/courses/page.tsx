'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Loader from '../components/Loader/Loader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/Course/CourseCard';
import { useSearchParams } from 'next/navigation';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSilce';

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('title'); // Lấy từ khóa tìm kiếm từ URL
  const { data, isLoading,refetch } = useGetAllCoursesQuery({});
  const { data: categoriesData } = useGetHeroDataQuery('Categories', {});
  const { data: levelsData } = useGetHeroDataQuery('Levels', {});
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const { data: user } = useLoadUserQuery({});

  useEffect(() => {
    refetch();
    // Bắt đầu với tất cả khóa học
    let filteredCourses = data?.courses || [];

    if (user?.user.courses) {
      const userCourseIds = user.user.courses.map((course: any) =>
        typeof course === 'object' ? course._id : course
      );
      filteredCourses = filteredCourses.filter(
        (course: any) => !userCourseIds.includes(course._id)
      );
    }

    if (search) {
      filteredCourses = filteredCourses.filter((course: any) =>
        course.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All' && level !== 'All') {
      filteredCourses = filteredCourses.filter(
        (course: any) => course.category === category || course.level === level
      );
    } else if (category !== 'All') {
      filteredCourses = filteredCourses.filter((course: any) => course.category === category);
    } else if (level !== 'All') {
      filteredCourses = filteredCourses.filter((course: any) => course.level === level);
    }

    setCourses(filteredCourses);
  }, [data, user, category, level, search]);

  const categories = categoriesData?.layout?.categories;
  const levels = levelsData?.layout?.levels;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header route="Login" setRoute={() => {}} open={false} setOpen={() => {}} activeItem={1} />
          <div className="w-[95%] md:w-[85%] m-auto min-h-[70vh]">
            <Suspense fallback={<Loader />}>
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
                  {categories &&
                    categories.map((item: any, index: number) => (
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
                  {levels &&
                    levels.map((item: any, index: number) => (
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
            </Suspense>
          </div>
          <br />
          <br />
          <br />
          <br />

          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
