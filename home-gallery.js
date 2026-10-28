/* Appliance Tech Co homepage gallery — deterministic stacked photo cards. */
document.addEventListener('DOMContentLoaded',()=>{
 const grid=document.getElementById('homeWorkGrid');if(!grid)return;
 const projects=window.ULTRAMAX_SITE?.projects||[];
 const buttons=[...document.querySelectorAll('[data-gallery-filter]')];
 const more=document.getElementById('homeWorkMore');
 function render(category){
   const items=(category==='All'?projects:projects.filter(p=>p.category===category)).slice(0,4);
   grid.replaceChildren();
   items.forEach(p=>{
     const card=document.createElement('a');card.className='work-photo-card';card.href='gallery.html?service='+encodeURIComponent(category);
     card.setAttribute('aria-label','View '+p.title+' in the gallery');
     const media=document.createElement('div');media.className='work-photo-media';
     const image=document.createElement('img');image.src=p.image;image.alt=p.title;image.loading='lazy';image.decoding='async';media.append(image);
     const caption=document.createElement('div');caption.className='work-photo-caption';
     const label=document.createElement('strong');label.textContent=p.title;
     const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');caption.append(label,arrow);
     card.append(media,caption);grid.append(card);
   });
   if(more){more.href='gallery.html?service='+encodeURIComponent(category);more.textContent=category==='All'?'Browse the full gallery ↗':'See all '+category+' photos ↗';}
 }
 buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(other=>{let chosen=other===btn;other.classList.toggle('active',chosen);other.setAttribute('aria-pressed',String(chosen));});render(btn.dataset.galleryFilter);}));render('All');
});
