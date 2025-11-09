// Thanks to rnheroes/react-native-pitchy for the original implementation
// https://github.com/rnheroes/react-native-pitchy/blob/main/android/cpp-adapter.cpp

#include <jni.h>
#include "../../../../shared/ReactNativeLivePitchDetectionModule.h"
#include <vector>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <limits>

extern "C" JNIEXPORT jdouble JNICALL
Java_io_techopt_lib_reactnativelivepitchdetection_ReactNativeLivePitchDetectionModule_nativeAutoCorrelate(JNIEnv *env, jobject thiz, jshortArray buffer, jint sampleRate, jdouble minVolume)
{   
    jshort *buf = env->GetShortArrayElements(buffer, 0);
    jsize size = env->GetArrayLength(buffer);
    std::vector<double> vec(buf, buf + size);
    env->ReleaseShortArrayElements(buffer, buf, 0);

    double result = techoptio::reactnativelivepitchdetection::autoCorrelate(vec, sampleRate, minVolume);
    return result;
}