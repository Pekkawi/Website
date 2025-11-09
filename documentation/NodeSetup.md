To deploy the website you would first flash a new image of Raspberry PI Lite on an SD card and then plug it into your Raspberry PI

(Link tutorial here)

# Setup

afterwards there are a couple of steps that we will go over

1. Connect to your raspberry pi using a monitor and find out the IP of it

enter it using ssh pi@<...>

enter the password you had previously set

```
sudo apt-get update
sudo apt-get upgrade
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt-get install git docker docker.io gitlab-runner -y

```

Enable the docker daemon

You might need to run some commands with sudo priviliges

```
sudo groupadd docker
sudo usermod -aG docker $USER
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
docker run hello-world


```

great now that you have installed all of this go into the GitLab Repository

--> go to settings ---> CI/CD ---> Click on Runners --->
Create project runner the tags will be

build and deploy for now
if you ever plan on adding other stages make sure to edit the runner for this setup :D

"
stages:

- build
- deploy
  "

When prompted on adding a
Enter the GitLab instance URL (for example, https://gitlab.com/): [Don't write anything, just press enter]

When prompted what executor write
docker
what version?
docker:latest

Run

```
sudo nano /etc/gitlab-runner/config.toml
and add the following command
[[runners]]
  [runners.docker]
    volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/cache"]
```

concurrent = 2
check_interval = 0
connection_max_age = "15m0s"
shutdown_timeout = 0

[session_server]
session_timeout = 1800

[[runners]]
name = "TheCore"
url = "https://gitlab.com"
id = 50035979
token = "glrt-08UEGl11mFf2i-9YsI1UFG86MQpwOngzNDMzCnQ6Mwp1OmJ5OHA3Fw.01.1i1e5bks0"
token_obtained_at = 2025-10-05T17:23:12Z
token_expires_at = 0001-01-01T00:00:00Z
executor = "docker"
[runners.cache]
MaxUploadedArchiveSize = 0
[runners.cache.s3]
[runners.cache.gcs]
[runners.cache.azure]
[runners.docker]
tls_verify = false
image = "docker:latest"
privileged = false
disable_entrypoint_overwrite = false
oom_kill_disable = false
disable_cache = false
volumes = ["/var/run/docker.sock:/var/run/docker.sock","/cache"]
shm_size = 0
network_mtu = 0

1. Cloning the repository

2. Downloading the necessary libraries to run the website

3. Setup the required permission to run the website

4. Setup gitlab runner and activate service

5. Verify if it's running correctly

# Connect website to DNS (Explain what DNS is)

If we were to run the website as it was it would only be running on the local network
Out of curiosity you can check it by going into pi terminal and getting the IP.

Than on your Laptop look for: http://<Raspberry_PI_IP>:3000

So now we need to connec the raspberry pi to the open internet...

welp, how?

Explain a bit what DNS is and abt the internet:

Every website has a URL but a URL is short for a Public IP like 128.120....

It would be hard to search it like that, no? That's why we have words instead! and each of these 'wordy' URLS is associated

with a public ID and a port. 128.120.213:3000

What is a port? Imagine a PORT (imagine a USB PORT). And your laptop or raspberry pi has thousands of those. Each outlet is a possible way to connect to your laptop through your USB PORT. On your laptop you might have 3 USB ports and they are numbered USB Port 1,2,3. The same thing it is with these Ports on your machine, they are ways you can communicate to your laptop through these ports.
Why specifically 3000 for a website? It's just a standard, you could run a website on any (FREE, some might be taken by your laptops functions so check beforehand) port you like.

# Add security

[Here it would probably be a good idea to have an automated script to run the instructions like setting up a firewall, fail2ban etc. etc.]

```

```
