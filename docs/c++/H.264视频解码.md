## H.264视频解码

```c++
// 获取解码器
m_codec=avcodec_find_decoder(AV_CODEC_ID_H264);

//初始化解析器
if(!m_parser)
    m_parser = av_parser_init(AV_CODEC_ID_H264);

// 分配codec上下文67
if(!m_decoder)
    m_decoder=avcodec_alloc_context3(m_codec);

// 将解码器和解码器上下文关联
if (avcodec_open2(m_decoder, m_codec, NULL) < 0) {
    fprintf(stderr, "Could not open codec\n");
    return false;
}

// 创建AVPacket
if(!m_avpkt)
    m_avpkt=av_packet_alloc();

// 创建AVFrame
if(!m_frame)
    m_frame = av_frame_alloc();
```

```c++
int H264Decoder::phaseData(char *data, int length)
{
    if (!data){
        return 1;
    }
    //从数据流中解码出图像
    while(length){
        //从数据流中获取AVPaket数据
        int parsedLength = av_parser_parse2(m_parser,m_decoder,&m_avpkt->data,&m_avpkt->size,(const uint8_t*)data,length,AV_NOPTS_VALUE,AV_NOPTS_VALUE,AV_NOPTS_VALUE);
        data += parsedLength;
        length -= parsedLength;
        //如果已获取一帧数据
        if (m_avpkt->size){
            //测试
            d_readSize = 0;
            //测试
            phaseFrame();
        }
    }
    return 0;
}

int H264Decoder::phaseFrame()
{
    int ret;
    AVFrame *tmp_frame = nullptr;//临时空间
    m_needInit = true;//解码器接收数据后置为true

    // 给解码器传入包含原始压缩数据的AVPacket对象
    ret=avcodec_send_packet(m_decoder,m_avpkt);
    if (ret<0){
        fprintf(stderr,"Error during decoding ret:%d\n",ret);
         releaseDecoder();
         initFrame(m_cuda);
        return ret;
    }
    m_needInit = true;//解码器接收数据后置为true

    while(ret>=0){
        // 从解码器返回已解码的输出数据
        ret=avcodec_receive_frame(m_decoder,m_frame);
        if(ret==AVERROR(EAGAIN)||ret==AVERROR(AVERROR_EOF))
            return 0;
        else if(ret<0){
            fprintf(stderr,"Error while decoding ret:%d\n",ret);
            return ret;
        }
        if (m_out_buffer == nullptr) {
            m_BGRsize = avpicture_get_size(AV_PIX_FMT_RGB24, m_decoder->width,m_decoder->height);
//            m_out_buffer = (uint8_t *)av_malloc(m_BGRsize);
            m_out_buffer = new uint8_t[m_BGRsize];
            //初始化一个AVPicture结构体，并将它与一段内存关联起来，这段内存用于存储图像数据
            avpicture_fill((AVPicture *)m_pFrameBGR, m_out_buffer, AV_PIX_FMT_RGB24,
                           m_decoder->width, m_decoder->height);

            if(m_cuda==true)
                m_img_convert_ctx = sws_getContext(m_decoder->width, m_decoder->height,(enum AVPixelFormat)23 ,
                                                   m_decoder->width, m_decoder->height, AV_PIX_FMT_RGB24, SWS_BICUBIC, NULL, NULL, NULL);
            else
                m_img_convert_ctx = sws_getContext(m_decoder->width, m_decoder->height,(enum AVPixelFormat)0 ,
                                               m_decoder->width, m_decoder->height, AV_PIX_FMT_RGB24, SWS_BICUBIC, NULL, NULL, NULL);
            m_lastWidth = m_decoder->width;
            m_lastHeight = m_decoder->height;
        }
        if(m_lastWidth != m_decoder->width || m_lastWidth != m_frame->width || m_lastHeight != m_decoder->height ||m_lastHeight != m_frame->height){
            releaseDecoder();
            initFrame(m_cuda);
            return 0;
        }
        if (ret>=0) {
            m_frame_count++;
            m_matReady = true;
            if (m_frame->format == hw_pix_fmt) {
                /* retrieve data from GPU to CPU */
                //av_hwframe_transfer_data()将数据复制到硬件或从硬件复制数据。
                if (av_hwframe_transfer_data(sw_frame, m_frame, 0) < 0) {
                    fprintf(stderr, "Error transferring the data to system memory\n");
                }
                tmp_frame = sw_frame;
            }
            else
                tmp_frame = m_frame;
            sws_scale(m_img_convert_ctx, (const uint8_t *const *)tmp_frame->data,
                      tmp_frame->linesize, 0, tmp_frame->height, m_pFrameBGR->data, m_pFrameBGR->linesize);
            // sws_scale(m_img_convert_ctx, (const uint8_t *const *)tmp_frame->data,
            //           tmp_frame->linesize, 0, m_decoder->height, m_pFrameBGR->data, m_pFrameBGR->linesize);
            if(m_getImgFunc!=nullptr){
                // 将解码后的图像输出
                m_getImgFunc(m_out_buffer, tmp_frame->width, tmp_frame->height,3);
                // m_getImgFunc(m_out_buffer, m_decoder->width, m_decoder->height,3);
            }
        }
        else {
            m_matReady = false;
        }
    }
    return ret;
}
```

![image-20240123132954262](C:\Users\jyb\AppData\Roaming\Typora\typora-user-images\image-20240123132954262.png)

1. av_parser_parse2从数据流中获取AVPaket数据
2. avcodec_send_packet给解码器传入包含原始压缩数据的AVPacket对象
3. avcodec_receive_frame从解码器返回已解码的输出数据，存储在AVFrame中
4. AVPacket负责存储压缩的音视频数据
5. AVFrame用于存储解码后的音视频数据
