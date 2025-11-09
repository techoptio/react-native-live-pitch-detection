#ifndef REACT_NATIVE_LIVE_PITCH_DETECTION_MODULE_H
#define REACT_NATIVE_LIVE_PITCH_DETECTION_MODULE_H

#include <vector>

namespace techoptio { 
    namespace reactnativelivepitchdetection {
        double autoCorrelate(const std::vector<double> &buf, double sampleRate, double minVolume);
    }
}

#endif