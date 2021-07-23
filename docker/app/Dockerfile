FROM python:3.9.6-slim-buster

ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      software-properties-common && \
    apt-get clean && rm -r /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
            gcc \
            g++ \
            libffi-dev \
            libgdbm-dev \
            libgmp-dev \
            libncurses5-dev \
            libreadline-dev \
            libssl-dev \
            libyaml-dev \
            make \
            autoconf \
            bison \
            git \
            tzdata \
            unzip \
            zlib1g-dev \
            dpkg-dev \
            wget \
            zip \
            curl \
            xz-utils && \
            apt-get clean && rm -r /var/lib/apt/lists/*

RUN cd /tmp && \
    wget https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.2.tar.gz && \
    tar zxvf ruby-2.7.2.tar.gz && \
    cd ruby-2.7.2 && \
    ./configure --disable-install-doc && \
    make && \
    make install && \
    gem install bundler aws-sdk && \
    cd .. && rm -rf ruby-2.7.2

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && apt-get clean && rm -r /var/lib/apt/lists/*

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.2.21.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm awscliv2.zip && rm -rf ./aws

RUN pip install aws-sam-cli==1.27.1

WORKDIR /app
