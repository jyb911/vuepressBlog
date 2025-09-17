## hplayer播放器

找bug的过程就像刑警抓凶手，首先大方向要正确，然后逐步缩小范围

视频文件中包括视频流、音频流、元数据（包括标题、出演者、导演信息、创建日期、地理位置等）、字母流、章节信息、编码器配置信息、标签等

转码过程：

1. 打开视频文件
2. 查找视频流
3. 获得视频**封装格式**
4. 打开目标文件流
5. 新建目标视频流
6. 编码器参数设置
7. 写入头部信息
8. 逐帧读取视频码流数据并进行转码
9. 写入尾巴帧

封装协议：flv、rtp、ts、mp4、avi、rmvb、mkv

编码格式：h264、h265、mgpeg

AVPacket中存储的是经过编码的压缩数据

AVStream中存储有关流的信息（视频流或音频流）

AVFrame帧

pts时间戳

dts解压缩时间戳

stream_index当前包所有流的索引

duration当前包解码后的帧播放持续时间

time_base时间基本单位的分数表示

nb_streams媒体文件中包含流的数量

```c++
//分配AVFormat上下文
AVFormatContext* avformat_alloc_context();
//打开输入文件
int avformat_open_input(AVFormatContext **ps, const char *url, ff_const59 AVInputFormat *fmt, AVDictionary **options);
//读取媒体文件的packet来获取流信息
int avformat_find_stream_info(AVFormatContext *ic, AVDictionary **options);
//获取音频流或视频流索引
int av_find_best_stream(AVFormatContext *ic,
                        enum AVMediaType type,
                        int wanted_stream_nb,
                        int related_stream,
                        AVCodec **decoder_ret,
                        int flags);
//获取解码器
AVCodec* avcodec_find_decoder(enum AVCodecID id);
//分配codec上下文
AVCodecContext *avcodec_alloc_context3(const AVCodec *codec);
//基于编解码器参数fill编解码器上下文
int avcodec_parameters_to_context(AVCodecContext *codec,
                                  const AVCodecParameters *par);
//将解码器和解码器上下文关联
it avcodec_open2(AVCodecContext *avctx, const AVCodec *codec, AVDictionary **options);
//返回一个流的下一帧，将存储在文件中的内容分成若干帧，每次调用时返回一帧
int av_read_frame(AVFormatContext *s, AVPacket *pkt);
//将原始压缩packet数据输入给一个解码器
int avcodec_send_packet(AVCodecContext *avctx, const AVPacket *avpkt);
//从解码器中获得已解码的frame
int avcodec_receive_frame(AVCodecContext *avctx, AVFrame *frame);
```

libswscale是一个主要用于处理图片像素数据的类库，可以完成图片像素格式的转换，图片的拉伸等

SDL（Simple DirectMedia Layer）是一个非常流行和强大的跨平台开发库，它主要被用来开发视频游戏和实时多媒体应用程序。它提供了一系列的功能来处理视频、音频、键盘、鼠标、操纵杆、图形硬件加速以及聚焦3D硬件的各种功能。在音视频开发方面，SDL提供了基础的API来进行音频播放和视频的渲染