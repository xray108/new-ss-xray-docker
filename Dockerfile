FROM alpine:3.13

ENV XRAY_PLUGIN_VERSION v1.3.1
ENV HOST        mydomain.me
ENV SERVER_ADDR 0.0.0.0
ENV SERVER_PORT 1080
ENV PASSWORD    password
ENV METHOD      chacha20-ietf-poly1305
ENV OBFS_PLUGIN xray-plugin
ENV OBFS_OPTS   server
ENV ARGS=

RUN set -ex \
      && export arch=$(uname -m) \
      && echo ${arch} \
      && if [ "${arch}" = "x86_64" ]; then export arch=amd64; fi \
      && if [ "${arch}" = "armv7l" ]; then export arch=arm; fi \
      && if [ "${arch}" = "aarch64" ]; then export arch=arm64; fi \
      && apk add shadowsocks-libev --no-scripts --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing \
      && apk add --no-cache --virtual .build-deps tar \
      && wget -O /root/xray-plugin.tar.gz https://github.com/teddysun/xray-plugin/releases/download/${XRAY_PLUGIN_VERSION}/xray-plugin-linux-${arch}-${XRAY_PLUGIN_VERSION}.tar.gz \
      && tar xvzf /root/xray-plugin.tar.gz -C /root \
      && if [ "${arch}" = "arm" ]; then export arch=arm7; fi \
      && mv /root/xray-plugin_linux_${arch} /usr/local/bin/xray-plugin \
      && rm -f /root/xray-plugin.tar.gz \
      && apk del .build-deps

USER nobody

CMD exec ss-server \
      -s $SERVER_ADDR \
      -p $SERVER_PORT \
      -k $PASSWORD \
      -m $METHOD \
      --fast-open \
      --plugin $OBFS_PLUGIN \
      --plugin-opts $OBFS_OPTS \
      $ARGS

EXPOSE $SERVER_PORT