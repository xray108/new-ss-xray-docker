FROM alpine:3.14

ENV XRAY_PLUGIN_VERSION v1.5.0
RUN set -ex \
      && export arch=$(uname -m) \
      && if [ "${arch}" = "x86_64" ]; then export arch=amd64; fi \
      && if [ "${arch}" = "armv7l" ]; then export arch=arm; fi \
      && if [ "${arch}" = "aarch64" ]; then export arch=arm64; fi \
      && wget -O /root/xray-plugin.tar.gz https://github.com/teddysun/xray-plugin/releases/download/${XRAY_PLUGIN_VERSION}/xray-plugin-linux-${arch}-${XRAY_PLUGIN_VERSION}.tar.gz \
      && tar xvzf /root/xray-plugin.tar.gz -C /root \
      && if [ "${arch}" = "arm" ]; then export arch=arm7; fi \
      && mv /root/xray-plugin_linux_${arch} /usr/local/bin/xray-plugin \
      && rm -f /root/xray-plugin.tar.gz

ENV SHADOWSOCKS_VERSION v1.12.0
RUN set -ex \
      && export toolchain=musl \
      && export arch=$(uname -m) \
      && if [ "${arch}" = "armv7l" ]; then export arch=arm && export toolchain=musleabihf ; fi \
      && wget -O /root/shadowsocks-plugin.tar.xz https://github.com/shadowsocks/shadowsocks-rust/releases/download/${SHADOWSOCKS_VERSION}/shadowsocks-${SHADOWSOCKS_VERSION}.${arch}-unknown-linux-${toolchain}.tar.xz \
      && tar xvf /root/shadowsocks-plugin.tar.xz -C /root \
      && mv /root/ss* /usr/local/bin/ \
      && rm -f /root/shadowsocks-plugin.tar.xz

USER nobody

ENV HOST        mydomain.me
ENV SERVER_ADDR 0.0.0.0:1080
ENV SERVER_PORT 1080
ENV PASSWORD    password
ENV METHOD      chacha20-ietf-poly1305
ENV PLUGIN      xray-plugin
ENV PLUGIN_OPTS server
ENV ARGS=

CMD exec ssserver \
      -s $SERVER_ADDR \
      -k $PASSWORD \
      -m $METHOD \
      --plugin $PLUGIN \
      --plugin-opts $PLUGIN_OPTS \
      $ARGS

EXPOSE $SERVER_PORT
