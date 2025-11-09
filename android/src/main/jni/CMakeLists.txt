cmake_minimum_required(VERSION 3.4.1)
project(ReactNativeLivePitchDetection)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 14)

add_library(reactnativelivepitchdetection            SHARED
            ../../../../shared/ReactNativeLivePitchDetectionModule.cpp
            cpp-adapter.cpp
)

# Specifies a path to native header files.
include_directories(
            ../../../../shared
)