<p align="center">
  <img src="https://github.com/user-attachments/assets/2efa20dc-304a-4379-afab-fa46a659fb19" width="512" heigth="120">
</p>


<p align="center">
  A JavaScript GUI that checks gas levels with an Arduino (and its MQ-2 gas sensor), developed as a project for the IoT Security course, part of the Computer Science Master's Degree program at the University of Salerno
</p>


## Table of Contents
- [Overview](#Overview)
- [Features](#Features)
- [Requirements](#Requirements)
- [How to replicate](#How-to-replicate)


## Overview 
<p>
Alarmino was built to provide a valuable tool in the context of real-time gas monitoring and safety alerts. The GUI enables users to monitor gas levels (detected via an Arduino equipped with an MQ-2 sensor), analyze atmospheric concentrations for potential leaks and then trigger an acoustic alarm.
</p>


## Features
1) Read gas values
2) Raise alarm if gas values exceed a user-defined threshold


## Requirements
- [Arduino UNO Wifi Rev2](https://store-usa.arduino.cc/products/arduino-uno-wifi-rev2)
- [Mosquitto](https://mosquitto.org/)


## How to replicate
1) Clone the repository
```bash
git clone https://github.com/raffaeleav/alarmino.git
```
2) Install dependencies
```bash
cd alarmino/gui
npm install
```
3) Flash certificates onto Arduino board
```bash
cd ..
cd scripts
./gen_certificates.sh
./flash_certificates.sh
```
4) Generate passwords and start broker
```bash
./gen_passwords.sh
./start_broker.sh
```
5) Start GUI
```bash
cd ..
cd gui
npm start
```
