gsap.registerPlugin(ScrollTrigger);

/* ---- Nav scroll state ---- */
const nav = document.getElementById('siteNav');
ScrollTrigger.create({
  start: 40, end: 99999,
  onUpdate: self => nav.classList.toggle('scrolled', self.scroll() > 40)
});

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---- Hero reveal timeline ---- */
const heroTl = gsap.timeline({defaults:{ease:'power3.out'}});
heroTl
  .from('#heroEyebrow', {opacity:0, y:14, duration:.7})
  .from('#heroTitle', {opacity:0, y:40, duration:1}, '-=0.4')
  .from('#heroSub', {opacity:0, y:20, duration:.8}, '-=0.6')
  .from('#heroActions', {opacity:0, y:20, duration:.8}, '-=0.55')
  .from('#searchCard', {opacity:0, y:50, duration:1}, '-=0.5')
  .from('.hero-bg img', {scale:1.3, duration:1.8, ease:'power2.out'}, 0);

/* ---- Hero parallax + arc draw ---- */
gsap.to('.hero-bg img', {
  yPercent: 14, ease:'none',
  scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
});
['#arc1','#arc2'].forEach((sel,i)=>{
  const path = document.querySelector(sel);
  const len = path.getTotalLength();
  gsap.set(path, {strokeDasharray:len, strokeDashoffset:len});
  gsap.to(path, {strokeDashoffset:0, duration:2.4, delay:.6+i*.3, ease:'power2.inOut'});
});

/* ---- Cards fading upward on scroll (destinations & packages) ---- */
gsap.utils.toArray('[data-reveal]').forEach((el,i) => {
  gsap.from(el, {
    opacity:0, y:56, duration:.9, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 88%'},
    delay: (i % 5) * 0.06
  });
});

/* ---- Section eyebrow + heading reveal ---- */
gsap.utils.toArray('.sec-head').forEach(head => {
  gsap.from(head.children, {
    opacity:0, y:30, duration:.8, stagger:.12, ease:'power3.out',
    scrollTrigger:{trigger:head, start:'top 85%'}
  });
});

/* ---- Experience cards ---- */
gsap.from('.exp-card', {
  opacity:0, x:60, duration:.8, stagger:.12, ease:'power3.out',
  scrollTrigger:{trigger:'#expScroll', start:'top 85%'}
});

/* ---- Map flight paths draw on scroll ---- */
['#pathA','#pathB','#pathC','#pathD'].forEach((sel,i) => {
  const path = document.querySelector(sel);
  const len = path.getTotalLength();
  gsap.set(path, {strokeDasharray:len, strokeDashoffset:len});
  gsap.to(path, {
    strokeDashoffset:0, duration:1.6, ease:'power2.inOut', delay:i*.25,
    scrollTrigger:{trigger:'#mapSvg', start:'top 75%'}
  });
});
gsap.utils.toArray('.map-dot').forEach((dot,i) => {
  gsap.from(dot, {scale:0, transformOrigin:'center', duration:.5, delay:i*.15+.3,
    scrollTrigger:{trigger:'#mapSvg', start:'top 75%'}});
  gsap.to(dot, {scale:1.4, duration:1, repeat:-1, yoyo:true, ease:'sine.inOut', delay: i*.3});
});

/* ---- Animated counters ---- */
gsap.utils.toArray('.counter h3').forEach(el => {
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter:() => {
      gsap.to(el, {
        innerText: target, duration: 1.8, ease:'power2.out', snap:{innerText:1},
        onUpdate: function(){ el.innerText = Math.floor(el.innerText).toLocaleString(); }
      });
    }
  });
});

/* ---- Testimonial carousel ---- */
const quotes = [
  {img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format', name:'Naomi Reyes', loc:'São Paulo, Brazil'},
  {img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format', name:'Julian Cho', loc:'Vancouver, Canada'},
  {img:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80&auto=format', name:'Amara Diallo', loc:'Lagos, Nigeria'}
];
const quoteEls = document.querySelectorAll('.testi-quote');
const dots = document.querySelectorAll('.testi-dots button');
const personImg = document.querySelector('.testi-person img');
const personName = document.querySelector('.testi-person .name');
const personLoc = document.querySelector('.testi-person .loc');
let testiIndex = 0;
function showTestimonial(i){
  gsap.to(quoteEls[testiIndex], {opacity:0, duration:.4, onComplete:()=>{
    quoteEls[testiIndex].classList.remove('active');
    quoteEls[i].classList.add('active');
    gsap.fromTo(quoteEls[i], {opacity:0,y:14}, {opacity:1,y:0,duration:.6});
  }});
  dots[testiIndex].classList.remove('active');
  dots[i].classList.add('active');
  gsap.to(personImg, {opacity:0, duration:.2, onComplete:()=>{
    personImg.src = quotes[i].img; personName.textContent = quotes[i].name; personLoc.textContent = quotes[i].loc;
    gsap.to(personImg, {opacity:1, duration:.3});
  }});
  testiIndex = i;
}
dots.forEach((d,i) => d.addEventListener('click', () => showTestimonial(i)));
let testiTimer = setInterval(()=> showTestimonial((testiIndex+1)%quoteEls.length), 6000);

/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq-item').forEach(item => {
  const answer = item.querySelector('.faq-a');
  if(item.classList.contains('open')) answer.style.maxHeight = answer.scrollHeight + 'px';
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ---- Button magnetic hover (desktop) ---- */
if(window.matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2, y = e.clientY - r.top - r.height/2;
      gsap.to(btn, {x:x*0.18, y:y*0.35, duration:.4, ease:'power2.out'});
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, {x:0, y:0, duration:.5, ease:'elastic.out(1,0.4)'}));
  });
}
