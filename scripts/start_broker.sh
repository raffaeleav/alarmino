#!/bin/bash

config_file_path=$(realpath "../broker/config/mosquitto.conf")

mosquitto -c ${config_file_path} -v