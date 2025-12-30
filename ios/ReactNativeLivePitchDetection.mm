// ReactNativeLivePitchDetection.mm

#import "ReactNativeLivePitchDetection.h"

#import <AVFoundation/AVFoundation.h>
#import <QuartzCore/QuartzCore.h>

@implementation ReactNativeLivePitchDetection
    AVAudioEngine *_audioEngine = nil;
    double _sampleRate = 44100;
    double _minVolume = -20.0;
    AVAudioFrameCount _bufferSize = 4096;
    int _updateIntervalMs = 100;
    BOOL _isListening = NO;
    NSTimeInterval _lastUpdateTime = 0;

- (void)setOptions:(double)bufferSize minVolume:(double)minVolume updateIntervalMs:(double)updateIntervalMs {
    _minVolume = minVolume;
    _updateIntervalMs = (int)updateIntervalMs;
    _bufferSize = (AVAudioFrameCount)bufferSize;
}

- (NSNumber *)isListening {
    return @(_isListening);
}

- (void)startListening:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  
    #if TARGET_IPHONE_SIMULATOR
        reject(@"E_NOT_SUPPORTED_ON_IOS_SIMULATOR", @"React Native Live Pitch Detection module is not supported on the iOS simulator. Please use a real device for testing.", nil);
        return;
    #endif

    if (_isListening) {
        reject(@"E_ALREADY_LISTENING", @"Already listening", nil);
        return;
    }
  
    AVAudioSession *session = [AVAudioSession sharedInstance];
    NSError *error = nil;

    [session setCategory:AVAudioSessionCategoryPlayAndRecord
                    mode:AVAudioSessionModeMeasurement
                 options:AVAudioSessionCategoryOptionDefaultToSpeaker
                   error:&error];

    if (error) {
        reject(@"E_SET_CATEGORY_FAILED", @"Failed to set audio session category", error);
        return;
    }

    error = nil;
    [session setActive:YES error:&error];

    if (error) {
        reject(@"E_SET_ACTIVE_FAILED", @"Failed to activate audio session", error);
        return;
    }

    if (!_audioEngine) {
        _audioEngine = [[AVAudioEngine alloc] init];

        AVAudioInputNode *inputNode = [_audioEngine inputNode];
        
        AVAudioFormat *format = [inputNode inputFormatForBus:0];
        if (format.sampleRate <= 0 || format.channelCount == 0) {
            format = [inputNode outputFormatForBus:0];
        }
        if (format.sampleRate <= 0 || format.channelCount == 0) {
            reject(@"E_INVALID_AUDIO_FORMAT", @"Invalid audio format for microphone input", nil);
            return;
        }
        _sampleRate = format.sampleRate;

        @try {
            [inputNode installTapOnBus:0 bufferSize:_bufferSize format:format block:^(AVAudioPCMBuffer * _Nonnull buffer, AVAudioTime * _Nonnull when) {
                [self detectPitch:buffer];
            }];
        } @catch (NSException *exception) {
            reject(@"E_INSTALL_TAP_FAILED", exception.reason ?: @"Failed to install audio tap", nil);
            return;
        }
    }

    [_audioEngine startAndReturnError:&error];
        
    if (error) {
        reject(@"E_SET_ACTIVE_FAILED", @"Failed to set audio engine active", error);
        return;
    }

    _isListening = YES;

    resolve(nil);
}

- (void)stopListening:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {

    if (!_isListening) {
        reject(@"E_NOT_LISTENING", @"Not listening", nil);
        return;
    }

    if (!_audioEngine) {
        reject(@"E_NOT_INITIALIZED", @"Not initialized", nil);
        return;
    }

    [_audioEngine stop];

    _isListening = NO;
    _lastUpdateTime = 0;
    resolve(nil);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeReactNativeLivePitchDetectionSpecJSI>(params);
}

- (void)detectPitch:(AVAudioPCMBuffer *)buffer {
    NSTimeInterval currentTime = CACurrentMediaTime();
    NSTimeInterval intervalSeconds = _updateIntervalMs / 1000.0;
    
    if (_lastUpdateTime == 0 || (currentTime - _lastUpdateTime) >= intervalSeconds) {
        float *channelData = buffer.floatChannelData[0];
        std::vector<double> buf(channelData, channelData + buffer.frameLength);

        double frequency = techoptio::reactnativelivepitchdetection::autoCorrelate(buf, _sampleRate, _minVolume);

        [self emitOnFrequencyDetected:@{@"frequency": @(frequency)}];
        
        _lastUpdateTime = currentTime;
    }
}

+ (NSString *)moduleName
{
  return @"ReactNativeLivePitchDetection";
}

@end
