gsap.from(".navbar li a ", {
  opacity: 0,
  delay: 0.4,
  stagger: 0.2,
});

gsap.from(".home img", {
  opacity: 0,
  delay: 0.3,
  x: -40,
});

gsap.from(".home h1 , .home p", {
  opacity: 0,
  delay: 0.3,
  y: 40,
  stagger: 0.2,
});

gsap.from(".navbar button", {
  opacity: 0,
  delay: 0.5,
  x: 30,
});



gsap.from(".More", {
  opacity: 0,
  delay: 0.3,
  y: 40,
  scrollTrigger: {
    trigger: ".More",
    scroller: "body",
    start: "top 98%",
  },
});

gsap.from(".feature", {
  opacity: 0,
  delay: 0.5,
  y: 40,
  stagger: 0.1,
  scrollTrigger: ".feat_con .feature",
});

gsap.from(".animate-bg h1 , .animate-bg button", {
  opacity: 0,
  delay: 0.2,
  y: 40,
  stagger: 0.1,
  scrollTrigger: ".animate-bg h1 , .animate-bg button",
});

gsap.from(".footer h4 ", {
  opacity: 0,
  y: 60,
  stagger: 0.1,
  scrollTrigger: ".footer h4",
});

gsap.from(".footer li ", {
  opacity: 0,
  y: 60,
  stagger: 0.1,
  scrollTrigger: ".footer li",
});

gsap.from(".pic img", {
  y: 10,
  repeat: -1,
  yoyo: true,
});
