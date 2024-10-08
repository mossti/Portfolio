---
title: 'Upper Limb Exoskeleton SEA Joint'
subtitle:
date: 2018-06-30 00:00:00
description:
featured_image: '/images/triplefollerjoint.jpg'
---

<img src="../images/sea.png">

This project was completed as my final project for the [Masters of Science in Robotics (MSR)](https://www.mccormick.northwestern.edu/robotics/) program at Northwestern University, under the guidance of Dr. Felix Huang and Dr. Matt Elwin (MSR program director). The goal was to design a compliant actuator which could be used in as a component in a rigid, rehabilitative exoskeleton. I ended up focusing on two key technologies in the design of this actuator: (1) series elastic actuation and (2) cable-driven actuation, both of which are employed regularly within the domain of rehabilitative and assistive robotics. Cables (under tension) wrap around two 3D-printed spools which face one another inside of a carbon fiber tube. The spools are fit with rotary encoders as well as rotary motors. There is a torsion spring connecting the two spools, and counts from the encoder are tracked to reflect the pressure on the spring at any given time. Embedded logic drives the motors to try to minimize pressure on the spring, which enables the joint to be compliant yet self-corrective (eg., if the motors have additional logic to help motivate training/rehabilitation exercises on the wearer, these actuators will not force the wearer to move; rather, they will push against the user and use that encoder feedback to reduce strain on the system as a whole).

### Check it out!
[Link to the SEA project repository on Github.](https://github.com/mossti/exo_rendering)

You can see the demo video below

<div>
<video class="center" src="{{site.baseurl}}/videos/MSR_2019_SEA_exo.mp4" data-canonical-src="{{site.baseurl}}/videos/MSR_2019_SEA_exo.mp4" controls="controls" style="max-height:640px;">

</video>
</div>

Won't play in browser? No problem! See the video on its host site [here!](https://www.youtube.com/watch?v=A_MqyhAG-6s)

<div class="gallery" data-columns="1">
    <img src="../images/spoolencoderattachment.jpg">
    <img src="../images/twinassembly.jpg">
    <img src="../images/prototype_topview.jpg">
    <img src="../images/assemblytestwithdycem.jpg">
    <img src="../images/dycemgrip.jpg">
    <img src="../images/adjustableclampwithdycem.jpg">
    <img src="../images/singleroller.jpg">
    <img src="../images/tripleroller.jpg">
    <img src="../images/triplefollerjoint.jpg">
</div>