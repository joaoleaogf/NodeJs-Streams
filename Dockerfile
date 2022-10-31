
FROM node:lts-slim

LABEL author="João Leâo"

RUN apt update && apt install -y \
    git gpg gnupg gpg-agent socat \
    ca-certificates \
    zsh \
    curl \
    wget \
    fonts-powerline \
    procps \
    lsof \
    docker


RUN yarn global add @nestjs/cli@9.1.4

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
    -t https://github.com/romkatv/powerlevel10k \
    -p git \    
    -p git-flow \
    -p https://github.com/zdharma-continuum/fast-syntax-highlighting \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions \
    -a 'export TERM=xterm-256color'

RUN touch ~/.p10k.zsh

RUN touch .env

RUN set -x && yarn

RUN echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc && \
    echo 'HISTFILE=/home/node/zsh/.zsh_history' >> ~/.zshrc

CMD ["scripts/start.sh"]
