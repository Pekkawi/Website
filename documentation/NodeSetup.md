To deploy the website you would first flash a new image of Raspberry PI Lite on an SD card and then plug it into your Raspberry PI

(Link tutorial here)

# Setup

afterwards there are a couple of steps that we will go over

1. Connect to your raspberry pi using a monitor and find out the IP of it

enter it using ssh pi@<...>

enter the password you had previously set

```
sudo-apt get update
sudo-apt get upgrade
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt-get install git docker docker.io gitlab-runner -y
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
