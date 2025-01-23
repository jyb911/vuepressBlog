QTcpSocket

- 状态改变时触发stateChanged信号

- 连接状态

  ```apl
  QAbstractSocket::UnconnectedState  0       The socket is not connected.
  QAbstractSocket::HostLookupState   1       The socket is performing a host name lookup.
  QAbstractSocket::ConnectingState   2       The socket has started establishing a connection.
  QAbstractSocket::ConnectedState    3       A connection is established.
  QAbstractSocket::BoundState        4       The socket is bound to an address and port.
  QAbstractSocket::ClosingState      6       The socket is about to close (data may still be waiting to be written).
  QAbstractSocket::ListeningState    5       For internal use only.
  ```

  - connectToHost发起连接
  - disconnectFromHost断开连接
  - write向套接字写数据
  - readAll从套接字中读数据

QTcpServer服务端

- listen监听
- newConnection信号，有客户端连接时触发
- nextPendingConnection方法获取为发起通信的客户端创建的套接字指针QTcpSocket*

utf-8可以表示Unicode标准中的任何字符