FROM ubuntu:latest
LABEL authors="damiand"

ENTRYPOINT ["top", "-b"]