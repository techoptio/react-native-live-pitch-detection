cmake_minimum_required(VERSION 3.16)
project(react_native_live_pitch_detection_tests LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG v1.15.2
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

add_executable(
  auto_correlate_tests
  auto_correlate_test.cpp
  ../ReactNativeLivePitchDetectionModule.cpp
)

target_include_directories(
  auto_correlate_tests
  PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}/..
)

target_link_libraries(
  auto_correlate_tests
  PRIVATE
  GTest::gtest_main
)

include(GoogleTest)
gtest_discover_tests(auto_correlate_tests)
